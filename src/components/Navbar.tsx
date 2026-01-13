import { NavLink } from "react-router-dom";

export function Navbar() {
  const baseLink =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors";

  const activeLink = "bg-zinc-800 text-white";
  const inactiveLink = "text-zinc-300 hover:bg-zinc-700 hover:text-white";

  return (
    <header className="bg-zinc-950 py-4">
      <nav className="mx-auto flex flex-wrap justify-center gap-2 bg-zinc-900 p-4 rounded-xl shadow-md w-fit">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/xone"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Duel
        </NavLink>

        <NavLink
          to="/bigtable"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Mesão
        </NavLink>

        <NavLink
          to="/gigant"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Gigante de 2 Cabeças
        </NavLink>

        <NavLink
          to="/hibrido"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          Commander Híbrido
        </NavLink>
      </nav>
    </header>
  );
}
