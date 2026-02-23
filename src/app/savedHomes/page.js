function savedHomes () {
   return (
    <div className="saved-header">
      <div className="left-section">
        <div className="saved-count">
          <div className="icon-box">✓</div>
          <span>5 Saved Homes</span>
        </div>

        <div className="dropdown">
          <button className="dropdown-btn">
            Show All <ChevronDown size={16} />
          </button>
        </div>

        <div className="dropdown">
          <button className="dropdown-btn">
            By Date <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="right-section">
        <button className="remove-btn">
          Remove <Trash2 size={16} />
        </button>
        <Menu size={22} className="menu-icon" />
      </div>
    </div>
  );
}