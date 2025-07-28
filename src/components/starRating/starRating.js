import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating: propRating = 0 }) {
  const [currentRating, setCurrentRating] = useState(propRating);
  const [hover, setHover] = useState(null);

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <label key={ratingValue}>
            <input
              className="hidden"
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setCurrentRating(ratingValue)}
            />
            <FaStar
              className="cursor-pointer"
              color={ratingValue <= (hover || currentRating) ? "#ffc107" : "#e4e5e9"}
              size={20}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}
