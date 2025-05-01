from termcolor import colored

def executor_worker(message: str) -> str:
    print(colored(f"Processing message: {message}", "red"))
    return "Documentation is created successfully."