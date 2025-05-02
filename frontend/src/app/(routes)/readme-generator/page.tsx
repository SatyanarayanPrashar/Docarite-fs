"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";

interface SectionStates {
    [key: string]: boolean;
}

const sectionLabels = [
    "Description",
    "Table of Contents",
    "Getting Started",
    "Installation",
    "Deployment",
    "Contributing guide",
    "License",
];

export default function ReadmeGenerator() {
    const [gitUrl, setGitUrl] = useState("");
    const [additionalMsg, setAdditionalMsg] = useState("");

    const [sections, setSections] = useState<SectionStates>(
        sectionLabels.reduce((acc, label) => {
            acc[label] = true; // Defaulting to true as per original Checkbox defaultChecked
            return acc;
        }, {} as SectionStates)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleCheckboxChange = (label: string) => {
        setSections((prevSections) => ({
            ...prevSections,
            [label]: !prevSections[label],
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        const includedSections = Object.entries(sections)
            .filter(([_, isChecked]) => isChecked)
            .map(([label]) => label)
            .join(", ");

        const payload = {
            git_url: gitUrl,
            // include_section: includedSections,
            // additional_mssg: additionalMsg,
        };

        console.log("Payload to send:", payload);

        try {
            const response = await fetch("http://127.0.0.1:8000/docarite/readme/build/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // Ignore if response body is not JSON
                }
                throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
            }

            console.log("Request successful:", payload);
            setResult(result_data);
        } catch (err) {
            console.error("Request failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full">
            {result ? (
                <div className="h-screen">
                    <MDEditor
                        value={result}
                        height={720}
                        onChange={(value) => setResult(value ?? null)}
                    />
                </div>
            ) : (
                <div className="w-1/2 h-screen bg-gradient-to-r from-blue-100/80 via-esmerald-600 to-blue-100/30 flex flex-col gap-8 p-20 overflow-y-auto"> {/* Added overflow-y-auto */}
                    <div>
                        <p className="mt-3 text-black font-light">Enter the URL of a public GitHub repository <span className="text-red-400">*</span> </p>
                        <input
                            type="text"
                            value={gitUrl}
                            onChange={(e) => setGitUrl(e.target.value)}
                            className="border p-2 rounded-sm font-extralight w-full border-black/30"
                            placeholder="https://github.com/owner/repo"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <p className="mt-3 text-black font-light">Select the sections <span className="text-red-400">*</span></p>
                        {sectionLabels.map((label) => (
                            <Checkbox
                                key={label}
                                label={label}
                                isChecked={sections[label]}
                                onChange={() => handleCheckboxChange(label)}
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    <div>
                        <p className="mt-3 text-black font-light">Additional instructions (optional)</p>
                        <textarea
                            value={additionalMsg}
                            onChange={(e) => setAdditionalMsg(e.target.value)}
                            className="border p-2 rounded-sm font-extralight w-full h-20 border-black/30 scrollbar-none"
                            placeholder="Ex. Add additional instructions if you need specific information to be included in the Readme, or if you want to provide more context to the AI."
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600 text-white font-bold rounded-md px-4 py-2 hover:bg-gradient-to-l hover:from-blue-500 hover:to-blue-400 w-40 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Process Files ✨'}
                    </Button>
                </div>
            )}
            {!result && (
                <div className="w-1/2 h-screen">
                    <div className="flex flex-col gap-4 items-center w-full justify-between text-black h-[25rem] p-20">
                        <p className="text-4xl font-medium text-transparent uppercase bg-clip-text bg-gradient-to-r from-blue-400 via-esmerald-600 to-blue-600"> <span className="font-bold">AI README</span> file generator</p>
                        <div className="flex justify-center border rounded-md">
                            <Image
                                className="rounded-md"
                                src="/readme.png"
                                alt="Next.js logo"
                                width={750}
                                height={500}
                                priority
                            />
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <p className="font-light text-xl">Customize your README file. Choose the sections you want to include.</p>
                            <p className="font-light text-xl">Our markdown editor allows you to write and edit your code documentation on-site. No need to switch between tools.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export function Checkbox({
    label,
    isChecked,
    onChange,
    disabled = false
}: {
    label: string;
    isChecked: boolean;
    onChange: () => void;
    disabled?: boolean;
}) {
    return (
        <div
            className={`flex gap-2 mt-1 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            onClick={() => !disabled && onChange()}
        >
            <input
                type="checkbox"
                className="border border-black/30 rounded-full pointer-events-none"
                checked={isChecked}
                readOnly
            />
            <p className="text-black font-light"> {label} </p>
        </div>
    )
}


const result_data = `
## Edloops Quiz

Edloops Quiz is a web application built using Next.js that allows users to engage with quizzes in an interactive way. The application leverages modern web technologies including React and Tailwind CSS to provide a smooth user experience and responsive design. We utilize various packages such as Lottie for animations and OpenAI for intelligent quiz functionalities.

### Technologies Used
- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling our components.
- **OpenAI**: Provides functionalities for dynamic quiz generation and AI integration.
- **Lottie**: Used for animation to enhance user engagement.
 
# Getting Started

## Prerequisites

To run this project, you will need to have the following installed:
- Node.js (>=14.x)
- npm (Node Package Manager)

## Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/edloops-quiz.git
   cd edloops-quiz
   \`\`\`
2. Install the dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
 
# Deployment

You can deploy the Edloops Quiz application using Vercel. Follow these steps:
1. Push your code to a GitHub repository.
2. Go to the [Vercel website](https://vercel.com/) and sign in or create an account.
3. Import your GitHub repository.
4. Follow the prompts to deploy your application.

For more detailed instructions, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
 
# Contributing

If you would like to contribute to the Edloops Quiz project, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request.
 
# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 

`