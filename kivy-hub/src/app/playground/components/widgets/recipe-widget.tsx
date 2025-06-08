import React from 'react';
import BaseFloatingWidget from '../core/base-floating-widget';

interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface RecipeWidgetProps {
  imageUrl?: string;
  title?: string;
  author?: string;
  steps?: string[];
  cookTime?: string;
  nutritionalInfo?: NutritionalInfo;
  weight?: string;
}

export default function RecipeWidget({
  imageUrl = 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2',
  title = 'Avocado Toast with Lemon',
  author = 'Chef Maria',
  steps = [
    'Toast bread slices until golden brown',
    'Mash ripe avocado and spread on toast',
    'Top with sliced tomatoes and red onions',
    'Squeeze fresh lemon juice over top',
    'Season with salt, pepper, and red pepper flakes'
  ],
  cookTime = '10 min',
  nutritionalInfo = {
    calories: 320,
    protein: 7,
    carbs: 24,
    fat: 21
  },
  weight = '250g'
}: RecipeWidgetProps) {
  return (
    <BaseFloatingWidget
      widgetType="recipe"
      initialX={20}
      initialY={20}
      width={400}
      height={600}
      showDragHandle={false}
      dragHandleHeight="25%"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-[400px] max-h-[80vh] overflow-y-auto">
        <div className='relative h-64 w-full'>
          <img
            src={imageUrl}
            alt={title}
            className='w-full h-full object-cover'
          />
          <div className='absolute top-3 right-3 bg-amber-500 text-white px-4 py-2 rounded-full text-base font-medium'>
            {cookTime}
          </div>
          <div className='absolute bottom-3 right-3 bg-blue-500 text-white px-4 py-2 rounded-full text-base font-medium'>
            {weight}
          </div>
        </div>

        <div className='p-6'>
          <h2 className='text-3xl font-bold text-gray-800 mb-3'>{title}</h2>
          <p className='text-gray-600 text-lg mb-4'>by {author}</p>

          <div className='bg-gray-50 p-4 rounded-lg mb-5'>
            <h3 className='font-semibold text-gray-700 text-lg mb-2'>Nutritional Info:</h3>
            <div className='grid grid-cols-4 gap-2'>
              <div className='text-center p-2 bg-white rounded shadow-sm'>
                <p className='font-bold text-xl text-gray-800'>{nutritionalInfo.calories}</p>
                <p className='text-sm text-gray-600'>calories</p>
              </div>
              <div className='text-center p-2 bg-white rounded shadow-sm'>
                <p className='font-bold text-xl text-gray-800'>{nutritionalInfo.protein}g</p>
                <p className='text-sm text-gray-600'>protein</p>
              </div>
              <div className='text-center p-2 bg-white rounded shadow-sm'>
                <p className='font-bold text-xl text-gray-800'>{nutritionalInfo.carbs}g</p>
                <p className='text-sm text-gray-600'>carbs</p>
              </div>
              <div className='text-center p-2 bg-white rounded shadow-sm'>
                <p className='font-bold text-xl text-gray-800'>{nutritionalInfo.fat}g</p>
                <p className='text-sm text-gray-600'>fat</p>
              </div>
            </div>
          </div>

          <div className='space-y-5'>
            <h3 className='font-semibold text-gray-700 text-xl mb-4'>
              Preparation Steps:
            </h3>
            <div className='space-y-4'>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className='bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100'
                >
                  <div className='flex items-center'>
                    <span className='bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 text-base'>
                      {index + 1}
                    </span>
                    <p className='text-lg text-gray-700'>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseFloatingWidget>
  );
}
