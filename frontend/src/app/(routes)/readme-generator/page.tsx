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
            include_section: includedSections,
            additional_mssg: additionalMsg,
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

            const data = await response.json();
            setResult(data.readme);
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

const llm_response = "{\"readme\":\"# Project Title and Description\\n\\n# Table of Contents\\n\\n# Getting Started\\n\\n# Deployment\\n\\n# Contributing guide\\n\\n# License\\n \\n# Project Title and Description\\n\\n## Attendance System\\n\\nThe Attendance System is a facial recognition application that utilizes Principal Component Analysis (PCA) for recognizing individuals from images. It aims to simplify attendance marking in various scenarios, leveraging advanced facial recognition technology for accuracy.\\n\\n## Technologies Used\\n\\nThis project is built using Python, which provides powerful libraries for image processing and machine learning. The PCA is utilized for dimensionality reduction and feature extraction from facial images.\\n \\n# Getting Started\\n\\n## Prerequisites\\n\\n- Python 3.x\\n- OpenCV\\n- NumPy\\n\\n## Step-by-step Guide\\n\\n1. Clone the repository:\\n   ```bash\\n   git clone https://your-repository-url.git\\n   cd attendanceSystem\\n   ```\\n2. Install the necessary libraries:\\n   ```bash\\n   pip install opencv-python numpy\\n   ```\\n3. Prepare your data:\\n   - Place the facial images in the `data/` directory. Create subfolders for each individual containing their images (e.g., `data/person1/`, `data/person2/`).\\n4. Run the main script to train the model:\\n   ```bash\\n   python main.py\\n   ```\\n \\n# Deployment\\n\\nTo deploy the Attendance System, ensure the following steps are completed:\\n\\n1. **Train the Model:** Execute the `main.py` script to train the facial recognition model. This step requires a dataset of images organized in the `data/` directory.\\n   ```bash\\n   python main.py\\n   ```\\n\\n2. **Run Face Recognition:** Use the `collect_faces.py` script for real-time face recognition and attendance marking. Make sure your machine has a working camera.\\n   ```bash\\n   python collect_faces.py\\n   ```\\n\\n3. **Attendance Tracking:** The attendance will be saved in an Excel file named `attendance.xlsx`, located in the project directory.\\n \\n# Contributing Guide\\n\\nContributions are welcome! If you would like to contribute to the Attendance System, please follow these steps:\\n\\n1. Fork the repository.\\n2. Create a new feature branch:\\n   ```bash\\n   git checkout -b feature/YourFeature\\n   ```\\n3. Make your changes and commit them:\\n   ```bash\\n   git commit -m 'Add some feature'\\n   ```\\n4. Push to the branch:\\n   ```bash\\n   git push origin feature/YourFeature\\n   ```\\n5. Open a pull request.\\n \\n# License\\n\\nThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.\\n \\n\"}"