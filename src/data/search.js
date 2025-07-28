"use client";
// import React from 'react';
// import { useState, useContext } from "react";
// import styles from './filterNavIndex.module.scss'
// import Link from "next/link";
// import Layout from '../../app/layout'
// import { XCicleIcon } from '@heroicons/react/outline'
import { useRouter } from "next/router";
import { Store } from '../utils/Store.js';

  
  const PAGE_SIZE = 4

  const price = [
    {
      name: 'N20,000 to N50,000',
      value: '1-50'
    },
    {
      name: 'N50,001 to N200,000',
      value: '51-200'
    },
    {
      name: 'N200,001 to N500,000',
      value: '201-500'
    },
    {
      name: 'N500,001 to N2,500,000',
      value: '501-2500',
    },
    {
      name: 'N2,500,001 to N10,000,000',
      value: '2500-10000',
    },
  ];

const ratings = [1, 2, 3, 4,5];

export default function Search(props) {
  const router = useRouter();
    const {
      query = 'all',
      category = 'all',
      propertyType = 'all',
      numberOfBed = 'all',
      price = 'all',
      rating = 'all'
      sort = 'featured',
      page = 1,
    } = router.query;

    const { property, countProperty, categories, propertyTypes, pages } = props;

    const filterSearch = ({
        page,
        category,
        propertyType,
        sort,
        min,
        max,
        searchQuery,
        price,
        rating,
    }) => {
        
        const { query } = router;
        if (page) query.page = page;
        if (searchQuery) query.searchQuery = searchQuery;
        if (sort) query.sort = sort;
        if (category) query.category = category;
        if (propertyType) query.propertyType = propertyType;
        if (price) query.price = price;
        if (rating) query.rating = rating;
        if (min) query.min ? query.min : query.min === 0 ? 0 : min;
        if (max) query.max ? query.max : query.max === 0 ? 0 : max;

        router.push ({
          pathname: router.pathname,
          query : query,
        });
    };
  const categoryHandler = (e) => {
    filterSearch ({ category: e.target.value });
  };
   const pageHandler = (e) => {
    filterSearch ({ category: e.target.value });
  };
   const propertyHandler = (e) => {
    filterSearch ({ category: e.target.value });
  };
   const priceHandler = (e) => {
    filterSearch ({ category: e.target.value });
  };
   const ratingHandler = (e) => {
    filterSearch ({ category: e.target.value });
  };
}

const {state, dispatch} = useContext(Store);
const addToSavedPageHandler = async (property) => {
  const existingItem = state.saved.savedItems.find((x) => x, _id === property._id);
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const { data } = await axios.fetch(`api/property/${property._id}`);

  if (data.countInStock < quantity) {
    toast.error('Sorry. Property is Sold out');
    return;
  }
  dispatch({ type: 'SAVED_ADD_ITEM', payload: { ...property, quantity } });
  router.push("savedPage")
};

return (
  <Layout title="search">
    <div className="grid md:grid-cols-4 md:gap-5">
      <div className="grid md:grid-cols-4 items-center md: gap-5 mb-6">
        <div>
          <h2>Category</h2>
          <select
            className='w-full'
            value={category}
            onChange= {categoryHandler}
            >
            <option value="all">All</option>
            {categories && 
              categories.map((category) => {
                <option key={category} value={category}>
                  {category}
                </option>
            })}
          </select>
        </div>
      </div>
    </div>
  </Layout>
)

