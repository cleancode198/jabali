import "../styles/slugfriend.css";

export function SlugFriend({ slugLink, referralActivated }) {
  return (
    <div className="modal modal-center">
      <div className="slug-friend-title">
        <h2 className="col-6">SLUG A FRIEND</h2>
        <div className="col-6 copy-area">
          <div className="col-3 copy-area-title">SLUG LINK</div>
          <div className="col-9 slug-link">
            <div className="col-9 slug-link-url">{slugLink}</div>
            <div
              className="col-3 copy-btn"
              onClick={() => {
                const textarea = document.createElement("textarea");
                textarea.value = slugLink;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
              }}
            >
              COPY
            </div>
          </div>
        </div>
      </div>
      <p>
        Refer a friend, earn crypto together. For every new user successfully
        referred to Unlucky Slug both referrer and referee receive a 2% cashback
        fees anytime the new referred user plays.
      </p>
      <div className="referral-sections">
        <div className="referral-section">
          <div className="referral-section-title">1. COPY LINK</div>
          Copy your slug link shown below.
        </div>
        <div className="referral-section">
          <div className="referral-section-title">2. REFER FRIENDS</div>
          Share your referral link with your friends and social media.
        </div>
        <div className="referral-section">
          <div className="referral-section-title">3. EARN CRYPTO</div>
          Earn a 2% cashback when your friends start playing.
        </div>
      </div>
      {referralActivated ? (
        <p className="referral-active">
          ✓&nbsp;&nbsp;&nbsp;Congratulations your referral plan is already
          active!
        </p>
      ) : (
        <p className="referral-inactive">
          X&nbsp;&nbsp;&nbsp;Your plan is still inactive. Get your referral link
          and start earning crypto.
        </p>
      )}
      <p>
        * To start receiving your cash back you must play at least 10 times to
        Unlucky Slug.
      </p>
    </div>
  );
}
