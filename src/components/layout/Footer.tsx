import Container from "./Container";
import FooterIllustration from "./FooterIllustration";

function Footer() {
  return (
    <footer className="bg-base-100">
      <div className="relative overflow-hidden">
        {/* Footer content inside Container */}
        <Container className="relative z-10 pt-12 pb-32 sm:pb-40 md:pb-48">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3
                className="text-lg font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Restaurant
              </h3>
              <p
                className="text-sm text-gray-500 leading-relaxed"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Delicious meals prepared with fresh ingredients and passion. Order your favorite dishes today.
              </p>
            </div>

            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Quick Links
              </h4>
              <ul
                className="space-y-2 text-sm text-gray-600"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                <li>
                  <a href="/" className="hover:text-gray-900 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/menu" className="hover:text-gray-900 transition-colors">
                    Menu
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Opening Hours
              </h4>
              <ul
                className="space-y-1.5 text-sm text-gray-600"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                <li>Mon – Fri: 10:00 AM – 10:00 PM</li>
                <li>Sat – Sun: 09:00 AM – 11:00 PM</li>
              </ul>
            </div>

            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3"
                style={{ fontFamily: "'Rubik', sans-serif" }}
              >
                Contact
              </h4>
              <p
                className="text-sm text-gray-600 mb-1"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                123 Food Street, Tasty City
              </p>
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                support@restaurant.com
              </p>
            </div>
          </div>
        </Container>

        {/* Full-width decorative illustration wrapper behind content */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 text-[var(--tree-color)]"
          aria-hidden="true"
        >
          <FooterIllustration />
        </div>
      </div>

      {/* Copyright area */}
      <div className="border-t border-base-200/80 bg-base-100/90 py-4 text-center text-xs text-gray-500 relative z-10">
        <p>© 2026 Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;