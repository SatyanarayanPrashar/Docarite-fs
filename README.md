# Docarite 🚀

Docarite is an AI-powered GitHub PR Reviewer designed to automate code quality checks, provide context-aware feedback, and streamline the bridge between issues and pull requests.


## ✨ Features

#AI-Powered Reviews: 
Leverages advanced LLMs to provide deep technical insights and catch bugs that static analysis might miss.In-line Comments: Delivers feedback directly on the relevant lines of code within the GitHub PR interface.Issue Integration: Automatically connects PR changes to existing GitHub issues for better traceability.Summary of Changes: Generates a concise, high-level overview of what the PR actually does.Customizable Style & Tone: Configure the reviewer to be "Strict," "Friendly," or "Educational" based on your team's culture.


### 🛠 Installation & Setup

You can run Docarite using Docker (recommended) or by setting up the services manually.

#### Manual Setup

1. Prerequisites
- Python 3.10+

- uv installed (pip install uv or via your system package manager)

2. Configure Environment
The system relies on a configuration file for API keys and environment settings.

Copy the example configuration:

```Bash

cp config.example.yaml config.yaml
```
Open config.yaml and fill in your credentials:

```YAML

llm:
  provider: "openai" # or "anthropic"
  api_key: "sk-..."
  model: "gpt-4o"

database:
  # ... database configs if applicable
```

3. Install Dependencies
Sync your virtual environment with uv:

```Bash

uv sync
```

4. Run ther server

```bash
uv run python manage.py runserver
```

2. Webhook ProxyTo receive events from GitHub on your local machine, use Smee:

```bash
npx smee -u https://smee.io/[url] --target http://127.0.0.1:8000/api/github/webhook/
```

To get the url you can create a proxy server at smee.io


4. Frontend (React/Next.js)Bashcd frontend
```bash
npm install
```

```bash
npm run dev
```


### 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. Since Docarite will be reviewing your PR, make sure your code is up to par! 🤖Would you like me to add a "Prerequisites" section listing the environment variables needed for the GitHub App and AI API keys?
