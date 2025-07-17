'use client'
import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'
import ShimmerButton from '@/components/ui/shimmer-button'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { containerVariants, itemVariants } from '@/lib/anims'
import Link from 'next/link'
import { formatURL } from '@/utils/language/lang'
import { useSearchParams } from 'next/navigation'
import { ReadApplicationByLeadID } from '@/utils/entities/application'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

interface Props {
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({ setStarted }:Props) => {

  const { t, lang } = useTranslationProvider()

  async function handleStartApplication() {
    setStarted(true)
  }

  return (
    <div className='w-full h-screen flex flex-col'>
      <Header/>
      <div className='flex-1 flex flex-col gap-y-10 bg-[url(/assets/backgrounds/bull.jpg)] w-full bg-cover bg-center z-0 justify-center items-center relative overflow-hidden'>
        <div className='w-full h-full opacity-60 bg-secondary-dark absolute z-1'></div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className='z-10 flex flex-col gap-y-8 justify-center items-center text-center px-4'
        >
          <motion.h1 variants={itemVariants} className='text-6xl md:text-7xl font-bold text-background'>
            {t('apply.account.title.ready')}
          </motion.h1>
          <motion.p variants={itemVariants} className='text-2xl md:text-3xl text-background max-w-2xl'>
            {t('apply.account.title.description')}
          </motion.p>
          <motion.div variants={itemVariants}>
            <p className='text-md text-background'>
              {t('apply.account.title.get_started')} <Link href={formatURL('/requirements', lang)} className='text-primary'>{t('apply.account.title.get_started_link')}</Link>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className='flex w-full gap-x-5 justify-center items-center'
          >
            <ShimmerButton
              onClick={handleStartApplication}
              className={`px-8 py-3 text-lg font-semibold mt-4`}
              background='#22c55e'
            >
                <p className="text-sm">
                  {t('apply.account.title.startApplication')}
                </p>
            </ShimmerButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Title