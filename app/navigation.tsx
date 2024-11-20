type Page = {
    title: string;
    path: `/${string}`;
  };
  
  // We hardcode pages here, but you could get this information from some external source (e.g. CMS, DB, config file, etc).
  const pages: Page[] = [
    { title: "Naslovnica", path: "/" },
    {
      title: "Pretraga filmova",
      path: "/pretraga_filmova",
    },
    {
      title: "Recenzije",
      path: "/recenzije",
    },
    {
      title: "Kolekcije",
      path: "/kolekcije",
    },
    {
      title: "Osobni profil",
      path: "/osobni_profil",
    },
    {
      title: "Korisnicke diskusije",
      path: "/korisnicke_diskusije",
    },
  ];
  
  function processPage(page: Page, index: number) {
    return (
      <li key={index}>
        <a href={page.path}>{page.title}</a>
      </li>
    );
  }
  
  export function Navigation() {
  return <ul className="flex space-x-4 mb-4">{pages.map(processPage)}</ul>;
}