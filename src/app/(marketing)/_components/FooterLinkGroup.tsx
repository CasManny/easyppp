import Link from "next/link";

interface FooterLinkGroupProps {
  group: {
    title: string;
    links: {
      label: string;
      href: string;
    }[];
  };
}
const FooterLinkGroup = ({ group }: FooterLinkGroupProps) => {
  return (
    <div>
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">{group.title}</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {group.links.map((link, index) => (
              <li key={index}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default FooterLinkGroup;
