import "../styles/navbar.css";

export function Navbar({ onNavChanged, currentPage }) {
  return (
    <div className="navbar">
      <span
        className={
          currentPage === "LOTTERY" || currentPage === "SLIMOMETER"
            ? "nav-item nav-item-selected"
            : "nav-item"
        }
        onClick={() => onNavChanged("LOTTERY")}
      >
        Lottery
      </span>
      <span
        className={
          currentPage === "ROADMAP" ? "nav-item nav-item-selected" : "nav-item"
        }
        onClick={() => onNavChanged("ROADMAP")}
      >
        Roadmap
      </span>
      <span
        className={
          currentPage === "FAQS" ? "nav-item nav-item-selected" : "nav-item"
        }
        onClick={() => onNavChanged("FAQS")}
      >
        Faqs
      </span>
    </div>
  );
}
