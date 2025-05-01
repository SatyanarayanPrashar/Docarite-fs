
from agents.executer_worker import executor_worker
from agents.planner_worker import planner_worker


workers = {
    # "docsfish": {
    #     "fn": worker_docarite,
    #     "description": "He is responsible to worker_docarite the plan for the documentation process of a codebase."
    # },
    "planner_worker": {
        "fn": planner_worker,
        "description": "He is responsible to worker_docarite the plan for the documentation process of a codebase."
    },
    "executor_worker": {
        "fn": executor_worker,
        "description": " He is responsible to execute the plan created by the planner."
    },
}