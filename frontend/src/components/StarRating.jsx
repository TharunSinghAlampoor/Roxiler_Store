import { useState } from 'react';

function StarRating({ value, onChange, readOnly }) {
  const [hoverValue, setHoverValue] = useState(0);

  function handleClick(starValue) {
    if (!readOnly && onChange) {
      onChange(starValue);
    }
  }

  return (
    <div className="star-rating" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        return (
          <span
            key={star}
            className={`star ${isFilled ? 'filled' : ''} ${!readOnly ? 'interactive' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            role={!readOnly ? 'radio' : undefined}
            aria-checked={!readOnly ? star === value : undefined}
            aria-label={`${star} star`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;
