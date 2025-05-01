from termcolor import colored
import json

from core.tool_manager import tools
from llm.gpt_client import base_llm_call
from utils import planner_prompt

def planner_worker(message: str) -> str:
    from core.agent_manager import workers

    messages = [
        {"role": "system", "content": planner_prompt},
    ]
    messages.append({ "role": "user", "content": message })

    while True:
        try:
            while True:
                response = base_llm_call(messages)

                parsed_output = json.loads(response)
                messages.append({ "role": "assistant", "content": json.dumps(parsed_output) })

                print(f"📝: {parsed_output.get('content')}")

                if parsed_output.get("function"):
                    tool_name = parsed_output.get("function")
                    tool_input = parsed_output.get("input")

                    if tool_name:
                        if tools.get(tool_name):
                            output = tools[tool_name].get("fn")(tool_input)
                            print(colored(f"tool called: {tool_name}, input: {tool_input} \n", "green"))
                            messages.append({
                                "role": "assistant",
                                "content": json.dumps({
                                    "agent": "planner",
                                    "output": output
                                })
                            })
                            continue
                        
                        if workers.get(tool_name):
                            output = workers[tool_name].get("fn")(tool_input)
                            print(f"planner output: {output}")
                            messages.append({
                                "role": "assistant",
                                "content": json.dumps({
                                    "agent": tool_name,
                                    "output": output
                                })
                            })
                            
                            # 🔥 check if documentation is done
                            if tool_name == "docsfish":
                                print(colored("✅ Documentation created. Exiting...", "green"))
                                break
                            continue
                    continue
            break

        except Exception as e:
            print(colored(f"Error: {e}", "red"))
            break
    return "Plan is created successfully. You can move to execution"
   