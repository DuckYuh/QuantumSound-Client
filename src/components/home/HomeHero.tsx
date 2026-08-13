export default function HomeHero() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
                Welcome to{" "}
                <span className="text-primary">
                    QuantumSound
                </span>
            </h1>

            <p className="text-lg text-muted-foreground">
                Discover and share your favorite music with the world.
            </p>
        </div>
    )
}