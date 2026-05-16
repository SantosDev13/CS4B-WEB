import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  quickLinks: [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/blog", label: "Blog" },
    { href: "/contacto", label: "Contacto" },
  ],
  services: [
    { href: "/servicios#licencias-microsoft", label: "Licencias Microsoft" },
    { href: "/servicios#antivirus", label: "Antivirus" },
    { href: "/servicios#hardware", label: "Hardware" },
    { href: "/servicios#desarrollo-software", label: "Desarrollo Software" },
    { href: "/servicios#consultoria-it", label: "Consultoría IT" },
    { href: "/servicios#capacitacion", label: "Capacitación" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Informacion de la empresa */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo_footer.png"
                alt="CS4B"
                width={80}
                height={28}
                className="h-auto w-auto"
              />
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed max-w-md">
              Consulting Strategic for Digital Business. 
              Transformamos empresas mediante soluciones 
              tecnológicas integrales en Perú.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3"> 
              <a
                href="https://www.linkedin.com/in/raulcastiglione/"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/cs4digitalbusiness"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Servicios
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} CS4B. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-white/40 hover:text-white transition-colors">
                Términos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
