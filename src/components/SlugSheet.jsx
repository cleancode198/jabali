import "../styles/slugsheet.css";

export function SlugSheet({ onNavChanged, currentPage }) {
  return (
    <div className="slugsheet" onClick={() => onNavChanged("SLUG_SHEET")}>
      <img
        src={
          process.env.PUBLIC_URL +
          "/assets/images/interface_elements/slugsheet.png"
        }
      />
      <span className={currentPage === "SLUG_SHEET" ? "nav-item-selected" : ""}>
        SLUG SHEET
      </span>
    </div>
  );
}
