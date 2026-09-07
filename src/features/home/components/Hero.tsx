import Button from "../../../components/common/Button";
function Hero() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Doppio+One&family=Roboto:wght@400;500;700&display=swap');`}</style>

      <section
        className="relative w-full overflow-hidden min-h-[400px] md:min-h-[500px] lg:min-h-[600px]"
        style={{
          background:
            "linear-gradient(135deg, #6b1317 0%, #8b1a1f 40%, #7a1519 100%)",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)",
          }}
        />

        {/* Dot particles */}
        <div
          className="absolute top-10 right-40 w-2 h-2 rounded-full opacity-40 hidden md:block"
          style={{ background: "#fff" }}
        />
        <div
          className="absolute top-32 right-60 w-1.5 h-1.5 rounded-full opacity-30 hidden md:block"
          style={{ background: "#fff" }}
        />
        <div
          className="absolute bottom-40 right-80 w-1 h-1 rounded-full opacity-25 hidden md:block"
          style={{ background: "#fff" }}
        />

        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          {/* ── Left column — Text ── */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-6 text-center lg:text-left">
            {/* Script tagline */}
            <p
              className="text-base sm:text-lg lg:text-xl italic m-0"
              style={{ color: "#f5a623" }}
            >
              Eat Sleep And
            </p>

            {/* Main heading */}
            <h1
              className="m-0 leading-tight"
              style={{
                fontFamily: "'Doppio One', sans-serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: "#fff",
              }}
            >
              Supper delicious
              <br />
              Burger in town!
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm sm:text-base lg:text-lg m-0 max-w-md mx-auto lg:mx-0"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Food is any substance consumed to provide nutritional support for
              an organism.
            </p>

            {/* CTA button */}
            <div className="mt-4 sm:mt-6">
              <Button to="/menu">
                Explore Menu
              </Button>
            </div>
          </div>

          {/* ── Right column — Hero image ── */}
          <div className="flex-1 flex justify-center lg:justify-end relative">
            {/* Decorative line-art icons */}
            <svg
              className="absolute -top-4 right-10 opacity-30 hidden sm:block"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
            >
              <circle cx="25" cy="25" r="20" />
              <circle cx="25" cy="25" r="10" />
            </svg>
            <svg
              className="absolute top-20 -left-4 opacity-25 hidden sm:block"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            >
              <path d="M10 30 Q20 5 30 30" />
              <line x1="20" y1="30" x2="20" y2="40" />
            </svg>

            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=500&fit=crop"
              alt="Delicious burger"
              className="relative z-10 object-cover w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[500px] max-w-[500px] h-auto rounded-xl"
              style={{
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
              }}
            />

            {/* Orange accent behind image */}
            <div
              className="absolute -right-6 top-8 bottom-8 w-12 sm:w-16 lg:w-20 rounded-lg hidden sm:block"
              style={{
                background: "#f5a623",
                opacity: 0.6,
              }}
            />
          </div>
        </div>

        {/* Carousel dots */}
        <div className="relative z-10 flex justify-center gap-2 pb-6 sm:pb-8">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{ background: "#f5a623" }}
          />
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{ background: "rgba(255,255,255,0.4)" }}
          />
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
            style={{ background: "rgba(255,255,255,0.4)" }}
          />
        </div>

        {/* Torn paper bottom edge */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden"
          style={{ height: "40px" }}
        >
          <svg
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,20 Q60,0 120,15 Q180,30 240,18 Q300,5 360,20 Q420,35 480,15 Q540,0 600,18 Q660,35 720,20 Q780,5 840,15 Q900,30 960,18 Q1020,5 1080,20 Q1140,35 1200,15 Q1260,0 1320,18 Q1380,35 1440,20 L1440,40 L0,40 Z"
              fill="#f9f5f0"
            />
          </svg>
        </div>
      </section>
    </>
  );
}

export default Hero;