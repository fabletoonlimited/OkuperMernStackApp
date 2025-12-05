"use client";
import { Star } from 'lucide-react';
import { useState } from "react";
import React from 'react'

const index = ({ maxStars = 5, onChange }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleClick = (value) => {
        setRating(value);
        if (onChange) onChange(value);
    };
    return (
        <div className='flex space-x-1'>
            {Array.from({ length: maxStars }, (_, i) => {
                const starValue = i + 1;
                return (
                    <Star
                        key={i}
                        size={28}
                        className={`cursor-pointer transition-colors ${
                            starValue <= (hover || rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400 fill-gray-400"
                      }`}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => handleClick(starValue)}
                    />
                );
            })}
          
        </div>
    );
};

export default index