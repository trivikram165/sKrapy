import { FC, useContext } from "react";
import { MouseContext } from "src/context/mouse-context";
import s from "./DontMint.module.scss";

interface Props {
  audioRef?: any;
}

const scrapCollection = [
  { name: "Copper Wires", price: "₹700/kg" },
  { name: "Aluminum Sheets", price: "₹150/kg" },
  { name: "Iron Rods", price: "₹35/kg" },
  { name: "Brass Fittings", price: "₹450/kg" },
  { name: "Steel Scrap", price: "₹40/kg" },
  { name: "Zinc Scrap", price: "₹180/kg" },
  { name: "Lead Scrap", price: "₹120/kg" },
  { name: "Tin Scrap", price: "₹300/kg" },
  { name: "Nickel Scrap", price: "₹900/kg" },
];

const paperShredding = [
  { name: "Office Paper", price: "₹12/kg" },
  { name: "Cardboard", price: "₹10/kg" },
  { name: "Newspapers", price: "₹8/kg" },
  { name: "Books", price: "₹9/kg" },
  { name: "Magazines", price: "₹7/kg" },
  { name: "Shredded Paper (Mixed)", price: "₹6/kg" },
  { name: "Paperboard", price: "₹11/kg" },
  { name: "Receipt Rolls", price: "₹5/kg" },
];

const vehicleScraping = [
  { name: "Car Body", price: "₹28/kg" },
  { name: "Bike Parts", price: "₹22/kg" },
  { name: "Batteries", price: "₹90/kg" },
  { name: "Tyres", price: "₹15/kg" },
  { name: "Radiators", price: "₹60/kg" },
  { name: "Engines (Car)", price: "₹45/kg" },
  { name: "Aluminum Wheels", price: "₹130/kg" },
  { name: "Catalytic Converters", price: "₹500/kg" },
];

const electronicWaste = [
  { name: "Laptops", price: "₹200/kg" },
  { name: "Mobile Phones", price: "₹300/kg" },
  { name: "Circuit Boards", price: "₹500/kg" },
  { name: "Monitors (CRT)", price: "₹20/kg" },
  { name: "Hard Drives", price: "₹150/kg" },
  { name: "Keyboards", price: "₹30/kg" },
  { name: "Cables and Wires", price: "₹100/kg" },
  { name: "Printers", price: "₹50/kg" },
];

const DontMint: FC<Props> = ({ audioRef }) => {
  const { cursorChangeHandler } = useContext(MouseContext);

  return (
    <div className={s.container}>
      <div className={s.grid}>
        <section className={s.section}>
          <h3 className={s.headingText}>Scrap Collection</h3>
          <div className={s.priceCard}>
            <div className={s.priceGrid}>
              {scrapCollection.map((item, index) => (
                <div key={index} className={s.priceItem}>
                  <span className={s.scrapType}>{item.name}</span>
                  <span className={s.scrapPrice}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section}>
          <h3 className={s.headingText}>Paper Shredding</h3>
          <div className={s.priceCard}>
            <div className={s.priceGrid}>
              {paperShredding.map((item, index) => (
                <div key={index} className={s.priceItem}>
                  <span className={s.scrapType}>{item.name}</span>
                  <span className={s.scrapPrice}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section}>
          <h3 className={s.headingText}>Vehicle Scraping</h3>
          <div className={s.priceCard}>
            <div className={s.priceGrid}>
              {vehicleScraping.map((item, index) => (
                <div key={index} className={s.priceItem}>
                  <span className={s.scrapType}>{item.name}</span>
                  <span className={s.scrapPrice}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.section}>
          <h3 className={s.headingText}>Electronic Waste</h3>
          <div className={s.priceCard}>
            <div className={s.priceGrid}>
              {electronicWaste.map((item, index) => (
                <div key={index} className={s.priceItem}>
                  <span className={s.scrapType}>{item.name}</span>
                  <span className={s.scrapPrice}>{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DontMint;