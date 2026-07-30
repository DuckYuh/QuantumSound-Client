import Image from "next/image";
import Link from "next/link";

type LogoProps = {
    href?: string;
    width?: number;
    height?: number;
    showText?: boolean;
    className?: string;
};

export function Logo({ 
    href = "/", 
    width = 40, 
    height = 40, 
    showText = false, 
    className, 
}: LogoProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 ${className ?? ""}`}
        >
            <Image
                src="/Logo.svg"
                alt="QuantumSound"
                width={width}
                height={height}
                priority
            />

            {showText && (
                <span className="text-lg font-bold">
                    QuantumSound
                </span>
            )}
        </Link>
    );
}