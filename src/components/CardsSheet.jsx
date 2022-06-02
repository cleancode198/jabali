import "../styles/cardssheet.css";

export function CardsSheet() {
  return (
    <>
      <div className="cards-sheet">
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/epic.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/goldenslug.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/legendary.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/rare.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/slug_sad.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/slugpot.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/x1.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/x10.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/x100.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/x1000.jpg"}
        />
        <img
          className="card"
          src={process.env.PUBLIC_URL + "/assets/images/Cards/x10000.jpg"}
        />
      </div>
      <div className="card-description">
        <h2>FREE SPIN CARD</h2>
        <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui
          blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
          et quas molestias excepturi sint occaecati cupiditate non provident,
          similique sunt in culpa qui officia deserunt mollitia animi, id est
          laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
          distinctio.
        </p>
        <p>
          Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
          impedit quo minus id quod maxime placeat facere possimus, omnis
          voluptas assumenda est, omnis dolor repellendus.
        </p>
      </div>
    </>
  );
}
