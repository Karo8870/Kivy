'use client';

import { KivyButton } from '@/components/buttons/kivy-button';
import { HeroCard } from '@/components/cards/hero-card';
import { Bot, Sparkles, Users } from 'lucide-react';
import { HandRecognitionDemo } from '@/components/demo/hand-recognition-demo';
import { LearnButton } from '@/components/buttons/learn-button';
import HomeWidget from '@/app/playground/components/widgets/home-widget';
import { WidgetProvider } from '@/app/playground/contexts/widget-context';
import { TimerProvider } from '@/app/playground/contexts/timer-context';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform
} from 'framer-motion';
import React, { useRef } from 'react';
import { TimerCard } from '@/app/playground/components/widgets/timer/timer-stack';

const TIMER_HEIGHT = 200;

export default function Home() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    offset: ['start end', 'end end'],
    target: ref
  });

  const op1 = useTransform(scrollYProgress, [0, 0.5, 0.6, 1], [1, 1, 0, 0]);
  const op2 = useTransform(scrollYProgress, [0, 0.5, 0.6, 1], [0, 0, 1, 1]);

  return (
    <main className='flex w-dvw flex-col items-center pb-40'>
      <img
        src='/hero-bg.png'
        alt='hero background'
        className='absolute top-0 left-0 min-w-dvw'
      />
      <section className='z-10 flex h-dvh flex-col items-center'>
        <h1 className='pt-80 text-8xl font-bold text-white'>Kivy</h1>
        <h2 className='max-w-[460px] pt-20 text-center text-5xl font-semibold text-white/80'>
          The <label className='text-[#FF5BB8]/80'>future</label> of{' '}
          <label className='text-[#5B66FF]/80'>cooking</label> starts here
        </h2>
        <div className='flex items-center gap-6 pt-9'>
          <KivyButton href='/playground'>Start cooking</KivyButton>
          <LearnButton className='w-40'>Learn more</LearnButton>
        </div>
      </section>
      <section className='z-20 flex items-center justify-between gap-10 px-32'>
        <HeroCard
          title='AI Advancements'
          icon={<Sparkles className='text-[#FF5BB8]' />}
        >
          We developed a new AI autoencoder model that can convert culinary
          recipes into dense vector representations in 512 dimensions. This
          model is trained on a dataset of 2.5 million recipes, allowing it to
          capture the essence of culinary creativity and innovation.
        </HeroCard>
        <HeroCard
          title='Innovative Hardware'
          icon={<Bot className='text-[#FF5BB8]' />}
        >
          Our hardware is designed to enhance the cooking experience with
          interactive widgets that allow you to control your kitchen devices
          seamlessly. From timers and cutting tools, to AI assistants and
          allergen detectors, we have it all.
        </HeroCard>
        <HeroCard
          title='Community oriented'
          icon={<Users className='text-[#FF5BB8]' />}
        >
          We plan to develop the tooling and software to allow users to create
          their own widgets, plugins, tools and many more.
        </HeroCard>
      </section>
      <section ref={ref} className='h-[400dvh] w-full'>
        <div className='sticky top-10 z-0 flex w-full justify-between px-32 pt-28'>
          <div className='flex max-w-min flex-col gap-2'>
            <h1 className='min-w-max text-6xl font-bold text-white'>
              Interactive Widgets
            </h1>
            <p className='text-xl text-white/60'>
              The whole software is designed to be modular and extensible. As
              such, we created multiple widgets to handle everything inside the
              kitchen. From a main hub where you can control anything, to simple
              timers
            </p>
            <HandRecognitionDemo />
          </div>
          <div className='relative grow'>
            <WidgetProvider>
              <TimerProvider>
                <motion.div
                  style={{
                    opacity: op1
                  }}
                  className='absolute top-0 left-0 flex h-full w-full items-center justify-center'
                >
                  <HomeWidget />
                </motion.div>
                <motion.div
                  style={{
                    opacity: op2
                  }}
                  className='absolute top-0 left-0 flex h-full w-full items-center justify-center'
                >
                  <div
                    className='relative flex flex-col gap-4'
                    style={{
                      height: `${TIMER_HEIGHT}px`,
                      width: '320px'
                    }}
                  >
                    <AnimatePresence>
                      <TimerCard
                        key={'test'}
                        timer={{
                          id: 'test',
                          initialTime: 20,
                          countdown: 20,
                          isRunning: false,
                          isPaused: false,
                          label: 'Timer'
                        }}
                        isExpanded={true}
                        index={0}
                        totalCount={1}
                        isTopmost={true}
                        onToggleExpand={() => {}}
                        onDragStart={() => {}}
                        onDragEnd={() => {}}
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>
              </TimerProvider>
            </WidgetProvider>
          </div>
        </div>
      </section>
      <LearnButton>Learn more about the hardware</LearnButton>
      <section className='z-10 flex flex-col items-center pt-20'>
        <h1 className='min-w-max text-6xl font-bold text-white'>
          Recipe Autoencoder
        </h1>
        <h2 className='bg-[linear-gradient(90deg,rgba(255,255,255,0.8)_0%,rgba(153,153,153,0.8)_99.64%)] bg-clip-text pt-4 text-5xl font-semibold text-transparent'>
          The best recipe encoder
        </h2>
        <div className='flex flex-col items-center pt-32'>
          <label className='text-2xl text-white/60'>Trained on</label>
          <h3 className='text-5xl font-semibold text-white'>
            2.500.000 Million Recipes
          </h3>
        </div>
        <div className='flex flex-col items-center pt-32'>
          <label className='text-2xl text-white/60'>Made of</label>
          <h3 className='text-5xl font-semibold text-white'>600.000 Params</h3>
        </div>
      </section>
      <LearnButton className='mt-20'>
        Learn more about the autoencoder
      </LearnButton>
    </main>
  );
}
