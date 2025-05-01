import json
import os
from core.tool_manager import tools
from termcolor import colored
from core.create_database import generate_embedding
from llm.gpt_client import base_llm_call
from tools.execution_tools import run_command
from tools.generate_streamlit_pages import generate_pages
from tools.structure_tools import list_output_structure
from utils.docsfish_prompt import system_prompt
import asyncio

messages = [
    {"role": "system", "content": system_prompt},
]

async def worker_docarite(git_url: str, mssg: str = "Create me the documentation for this codebase"):
    from core.agent_manager import workers

    if git_url:
        try:
            repo_name = git_url.split('/')[-1].replace('.git', '')
            output_dir = os.path.join(os.getcwd(), "clone_repos")
            code_path = os.path.join(output_dir, repo_name)

            res = run_command(f"git clone {git_url} {code_path}")
            print(colored(f"res: {res}", "cyan"))
            if(res["status"] == "error"):
                raise Exception("Repository not found. Please check the Git URL and try again.")
        except Exception as e:
            print(f"Error cloning repository: {e}")
            return

    await asyncio.to_thread(generate_embedding, code_path=code_path, repo_name="attendanceSystem.git")

    structure_tree = list_output_structure() 
    messages.append({ "role": "user", "content": mssg + "\n" + structure_tree })

    while True:
        try:
            while True:
                response = base_llm_call(messages)

                parsed_output = json.loads(response)
                messages.append({ "role": "assistant", "content": json.dumps(parsed_output) })

                print(f"🤖: {parsed_output.get('content')}")

                if parsed_output.get("function"):
                    tool_name = parsed_output.get("function")
                    tool_input = parsed_output.get("input")

                    if tool_name:
                        if tools.get(tool_name):
                            output = tools[tool_name].get("fn")(tool_input)
                            messages.append({
                                "role": "assistant",
                                "content": json.dumps({
                                    "agent": "Docsfish",
                                    "output": output
                                })
                            })
                            
                            # 🔥 check if documentation is done
                            if output == "Documentation is created successfully.":
                                print(colored("✅ Documentation created. Exiting...", "green"))
                                break
                            continue

                        if workers.get(tool_name):
                            workers[tool_name].get("fn")(tool_input)
                            print(f"planner output: {output}")
                            messages.append({
                                "role": "assistant",
                                "content": json.dumps({
                                    "agent": tool_name,
                                    "output": "Plan created successfully.",
                                })
                            })
                            
                            # 🔥 check if documentation is done
                            if output == "Documentation is created successfully.":
                                print(colored("✅ Documentation created. Exiting...", "green"))
                                break
                            continue
                    continue
            break

        except Exception as e:
            print(colored(f"Error: {e}", "red"))
            break