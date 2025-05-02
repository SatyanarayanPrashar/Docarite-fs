"use client"

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
