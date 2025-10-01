interface FireParticlesProps {
  count?: number;
}

export const FireParticles = ({ count = 60 }: FireParticlesProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="fire-sparks-container">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="fire-spark"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * -10}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              ['--spark-size' as any]: `${4 + Math.random() * 6}px`
            }}
          />
        ))}
      </div>
    </div>
  );
};
