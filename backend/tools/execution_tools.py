import json
import os
import subprocess

from termcolor import colored

def run_command(command: str, cwd: str = None, timeout: int = 10) -> dict:
    """
    Runs a shell command and prints logs in real-time.

    Args:
        command (str): The command to run.
        cwd (str, optional): Directory to run the command in.
        timeout (int, optional): Maximum duration to run the command.

    Returns:
        dict: {
            'status': 'Success' or 'Failure' or 'error',
            'message': Combined stdout and stderr output
        }
    """
    print(colored(f'Running command: {command}', 'yellow'))
    try:
        process = subprocess.Popen(
            command,
            shell=True,
            cwd=cwd,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT
        )

        output = []

        # Real-time output reading
        for line in iter(process.stdout.readline, ''):
            print(line, end='')
            output.append(line)

        process.stdout.close()
        process.wait(timeout=timeout)

        return {
            'status': 'success' if process.returncode == 0 else 'error',
            'message': ''.join(output).strip()
        }
    
    except subprocess.TimeoutExpired:
        process.kill()
        return {
            'status': 'error',
            'message': 'Command timed out'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

## Decripted
# def create_plan_file(plan: str):
#     """
#     Creates a plan file with the given content.

#     Args:
#         plan (str): The content of the plan.
#     """
#     if isinstance(plan, str):
#         plan = plan.encode().decode('unicode_escape')

#     # Create and write to the file
#     with open("plan.txt", "w") as file:
#         file.write(plan)
    
#     print(colored(f"Plan file created.", 'green'))

def read_plan_file(field: str = None):
    """
    Reads the content of the plan file.

    Returns:
        str: The content of the plan file.
    """
    print(colored(f"Reading {field}", 'yellow'))
    with open("plan.json", 'r') as file:
            data = json.load(file)
        
    if field in data:
        return {field: data[field]}
    else:
        return "All the steps are executed."

def update_plan_file(new_step: str = None):
    """
    Updates the content of the plan file.

    Returns:
        str: The content of the plan file.
    """
    if os.path.exists("plan.json"):
        with open("plan.json", 'r') as file:
            data = json.load(file)
    else:
        data = {}

    step_numbers = [int(key[4:]) for key in data.keys() if key.startswith('step') and key[4:].isdigit()]
    next_step = max(step_numbers) + 1 if step_numbers else 1

    data[f'step{next_step}'] = new_step

    with open("plan.json", 'w') as file:
        json.dump(data, file, indent=4)

    print(f"Added as step{next_step}")
    return f"Added as step{next_step}"