
import { useEffect, useState } from "react";

import {
  MapPin,
  CalendarDays,
  Clock,
  Search,
  ArrowRight,
  Trophy,
  Users,
  ShieldCheck
} from "lucide-react";

function Home() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
const [selectedSport, setSelectedSport] = useState("");
const [bookingDate, setBookingDate] = useState("");
const [preferredTime, setPreferredTime] = useState("");
const [filteredTurfs, setFilteredTurfs] = useState([]);
const [searchDone, setSearchDone] = useState(false);
const [selectedTurf, setSelectedTurf] = useState(null);
const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/turfs")
      .then((response) => response.json())
      .then((result) => {
        setTurfs(result.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching turfs:", error);
        setLoading(false);
      });
  }, []);
const handleSearch = () => {
  const results = turfs.filter((turf) => {
    const turfLocation = `${turf.location || ""} ${turf.address || ""}`.toLowerCase();

    const locationMatch = turfLocation.includes(
      searchLocation.toLowerCase()
    );

    const sportMatch = turf.sports.some(
      (sport) => sport.toLowerCase() === selectedSport.toLowerCase()
    );

    return locationMatch && sportMatch;
  });

  setFilteredTurfs(results);
  setSearchDone(true);

  setTimeout(() => {
    document.getElementById("turfs").scrollIntoView({
      behavior: "smooth"
    });
  }, 100);
};

const handleClearSearch = () => {
  setSearchLocation("");
  setSelectedSport("");
  setBookingDate("");
  setPreferredTime("");
  setFilteredTurfs([]);
  setSearchDone(false);
};


    
const handleBookTurf = () => {
  setSearchLocation(selectedTurf.address || selectedTurf.location || "");
  setSelectedSport(selectedTurf.sports[0] || "");
  setSelectedTurf(null);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

const handleBookingSubmit = async () => {
  try {
    setBookingMessage("");

    const turf = turfs.find((t) => {
      const location = `${t.location || ""} ${t.address || ""}`.toLowerCase();

      return (
        location.includes(searchLocation.toLowerCase()) &&
        t.sports.some((sport) => sport === selectedSport)
      );
    });

    if (!turf) {
      setBookingMessage("Please select a valid turf and sport.");
      return;
    }

    const [time] = preferredTime.split(" - ");
    const startTime = new Date(`${bookingDate}T${time}:00`);

    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        turf_id: turf.id,
        start_time: startTime.toISOString(),
        total_price: turf.price_per_hour
      })
    });

    const result = await response.json();

    setBookingMessage(
      result.success
        ? "Booking created successfully!"
        : "Booking could not be saved. Please try again."
    );
  } catch (error) {
    console.error("Booking error:", error);
    setBookingMessage("Unable to connect to the booking server.");
  }
};

const displayedTurfs = searchDone ? filteredTurfs : turfs;
  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-tag">
              <Trophy size={15} />
              WELCOME TO TURFVERSE
            </span>

            <h1>
              Choose Your Turf.
              <br />
              <span>Play Your Game.</span>
            </h1>

            <p>
              Discover premium sports turfs near you.
              Book your perfect playing space and enjoy
              every moment on the field.
            </p>

            <a href="#turfs" className="hero-btn">
              Explore Turfs <ArrowRight size={18} />
            </a>

            <div className="hero-features">
              <span><ShieldCheck size={17} /> Easy Booking</span>
              <span><Users size={17} /> All Sports</span>
            </div>
          </div>

          <div className="booking-card">
            <div className="booking-heading">
              <span className="booking-icon">⚽</span>
              <div>
                <h2>Book Your Turf</h2>
                <p>Find your perfect playing ground</p>
              </div>
            </div>

            <form
  className="booking-form"
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
>
  <label>Location</label>
  <div className="field">
    <MapPin size={19} />
    <input
      type="text"
      placeholder="Enter your location"
      value={searchLocation}
      onChange={(e) => setSearchLocation(e.target.value)}
      required
    />
  </div>

  <label>Select Sport</label>
  <div className="field">
    <Trophy size={19} />
    <select
      value={selectedSport}
      onChange={(e) => setSelectedSport(e.target.value)}
      required
    >
      <option value="">Select sport</option>
      <option value="Football">Football</option>
      <option value="Cricket">Cricket</option>
      <option value="Badminton">Badminton</option>
      <option value="Basketball">Basketball</option>
    </select>
  </div>

  <label>Booking Date</label>
  <div className="field">
    <CalendarDays size={19} />
    <input
      type="date"
      value={bookingDate}
      onChange={(e) => setBookingDate(e.target.value)}
      min={new Date().toISOString().split("T")[0]}
      required
    />
  </div>

  <label>Preferred Time</label>
  <div className="field">
    <Clock size={19} />
    <select
      value={preferredTime}
      onChange={(e) => setPreferredTime(e.target.value)}
      required
    >
      <option value="">Select time</option>
      <option>6 AM - 7 AM</option>
      <option>7 AM - 8 AM</option>
      <option>8 AM - 9 AM</option>
      <option>4 PM - 5 PM</option>
      <option>5 PM - 6 PM</option>
      <option>6 PM - 7 PM</option>
      <option>7 PM - 8 PM</option>
    </select>
  </div>

  <div className="booking-actions">
  <button type="submit" className="search-btn">
    <Search size={19} />
    Find Turfs
    <ArrowRight size={18} />
  </button>

  <button
    type="button"
    className="clear-btn"
    onClick={handleClearSearch}
  >
    Clear
  </button>
</div>
</form>
          </div>
        </div>

        <div className="hero-bottom">
          <span>PLAY MORE. WORRY LESS.</span>
          <span>BOOK YOUR GAME TODAY ↓</span>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=900"
            alt="Football ground"
          />
          <div className="image-label">
            <strong>100%</strong>
            <span>Passion for Sports</span>
          </div>
        </div>

        <div className="about-content">
          <span className="section-tag">ABOUT TURFVERSE</span>
          <h2>
            Your Game.
            <br />
            <span>Your Ground.</span>
          </h2>
          <p>
            TurfVerse makes sports booking simple. Find quality
            sports facilities, reserve your favourite time
            slots and enjoy refreshments without the hassle.
          </p>

          <div className="stats">
            <div><strong>Easy</strong><span>Booking</span></div>
            <div><strong>Fast</strong><span>Reservations</span></div>
            <div><strong>One</strong><span>Platform</span></div>
          </div>
        </div>
      </section>

      <section className="services section" id="services">
  <div className="section-heading">
    <span className="section-tag">WHAT WE OFFER</span>
    <h2>Everything for Your Game</h2>
    <p>More than just a place to play.</p>
  </div>

  <div className="service-grid">
    <div className="service-card">
      <img
        src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"
        alt="Football turf"
      />
      <h3>Turf Booking</h3>
      <p>Find and reserve your favourite sports ground.</p>
    </div>

    <div className="service-card">
      <img
        src="https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800"
        alt="Sports court"
      />
      <h3>Multiple Sports</h3>
      <p>Explore facilities for different sports.</p>
    </div>

    <div className="service-card">
      <img
        src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800"
        alt="Refreshing drinks"
      />
      <h3>Refreshments</h3>
      <p>Order drinks and refreshments for your game.</p>
    </div>
  </div>
</section>

      <section className="turfs section" id="turfs">
        <div className="section-heading">
          <span className="section-tag">FIND YOUR PLAYGROUND</span>
          <h2>Explore Popular Turfs</h2>
          <p>Discover a place where your game comes alive.</p>
        </div>

        {loading ? (
          <p>Loading turfs...</p>
        ) : displayedTurfs.length === 0 ? (
          <div className="empty-state">
  <span>🏟️</span>
  <h3>
    {searchDone ? "No matching turfs found" : "No turfs available"}
  </h3>
  <p>
    {searchDone
      ? "Try another location or sport."
      : "Please check again later."}
  </p>
</div>
        ) : (
          
<div className="turf-grid">
  {displayedTurfs.map((turf) => (
    <div className="turf-card" key={turf.id}>
      <div className="turf-card-image">
        {turf.image_url ? (
          <img
            src={turf.image_url}
            alt={turf.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          "🏟️"
        )}
      </div>

      <div className="turf-card-content">
        <h3>{turf.name}</h3>

        <p className="turf-location">
          <MapPin size={14} /> {turf.address}
        </p>

        <p className="turf-description">
          {turf.description}
        </p>

        <div className="turf-sports">
          {turf.sports.map((sport) => (
            <span className="turf-sport-badge" key={sport}>
              {sport}
            </span>
          ))}
        </div>

        <div className="turf-card-bottom">
          <div className="turf-price">
            <strong>₹{turf.price_per_hour}</strong>
            <span> / hour</span>
          </div>

          <button
  className="turf-view-btn"
  onClick={() => setSelectedTurf(turf)}
>
  View Details
  <ArrowRight size={16} />
</button>
        </div>
      </div>
    </div>
    ))}
</div>
        )}
      </section>

      <section className="refreshments section" id="refreshments">
  <div className="section-heading">
    <span className="section-tag">STAY REFRESHED</span>
    <h2>Refresh After the Game</h2>
    <p>Recharge yourself with refreshing drinks.</p>
  </div>

  <div className="refreshment-grid">
    <div className="refreshment-card">
      <img
        src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800"
        alt="Water bottle"
      />
      <h3>Mineral Water</h3>
      <p>Stay hydrated during your game.</p>
    </div>

    <div className="refreshment-card">
      <img
        src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800"
        alt="Fresh juice"
      />
      <h3>Fresh Juices</h3>
      <p>Enjoy refreshing fruit juices.</p>
    </div>

    <div className="refreshment-card">
      <img
        src="https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800"
        alt="Energy drink"
      />
      <h3>Energy Drinks</h3>
      <p>Recharge after an intense match.</p>
    </div>
  </div>
</section>
{selectedTurf && (
  <div className="modal-overlay">
    <div className="turf-modal">

      <button
        className="modal-close"
        onClick={() => setSelectedTurf(null)}
      >
        ✕
      </button>

      {selectedTurf.image_url && (
        <img
          src={selectedTurf.image_url}
          alt={selectedTurf.name}
          className="modal-image"
        />
      )}

      <div className="modal-content">
        <h2>{selectedTurf.name}</h2>

        <p>
          <MapPin size={16} />
          {selectedTurf.address}
        </p>

        <p>{selectedTurf.description}</p>

        <h3>Available Sports</h3>

        <div className="turf-sports">
          {selectedTurf.sports.map((sport) => (
            <span className="turf-sport-badge" key={sport}>
              {sport}
            </span>
          ))}
        </div>

        <h3 className="modal-price">
          ₹{selectedTurf.price_per_hour} / hour
        </h3>

        <button
  className="search-btn"
  onClick={handleBookTurf}
>
  Book This Turf
  <ArrowRight size={18} />
</button>
      </div>
    </div>
  </div>
)}
    </>
  );
}

export default Home;
