import "../styles/slugsheetmodal.css";

import { AvailableNfts } from "./AvailableNfts";
import { CardsSheet } from "./CardsSheet";

import { networkTypes } from "../utils/constants";

export function SlugSheetModal({
  currentTab,
  networkType,
  nfts,
  onTabChanged,
}) {
  return (
    <>
      <div className="slugsheet-tabs">
        {networkType === networkTypes.ethereum && (
          <div
            className={
              currentTab === "AVAILABLE_NFTS"
                ? "slugsheet-tab-active"
                : "slugsheet-tab"
            }
            onClick={() => {
              onTabChanged("AVAILABLE_NFTS");
            }}
          >
            AVAILABLE NFTS
          </div>
        )}
        <div
          className={
            currentTab === "CARDS_SHEET"
              ? "slugsheet-tab-active"
              : "slugsheet-tab"
          }
          onClick={() => {
            onTabChanged("CARDS_SHEET");
          }}
        >
          CARDS SHEET
        </div>
      </div>
      <div className="slugsheet-overlay"></div>
      {currentTab === "AVAILABLE_NFTS" && <AvailableNfts nfts={nfts} />}
      {currentTab === "CARDS_SHEET" && <CardsSheet />}
      <img
        className="slugsheet-image"
        src={
          process.env.PUBLIC_URL +
          "/assets/images/interface_elements/slugsheet.png"
        }
      />
    </>
  );
}
