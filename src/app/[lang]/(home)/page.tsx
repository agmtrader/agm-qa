'use client'
import Title from "@/components/public/title/Title";
import { Introduction } from "@/components/public/introduction/Introduction"
import Services from "@/components/public/services/Services";
import FAQ from "@/components/public/faq/FAQ";
import Team from "@/components/public/team/Team";
import { BarChart2, Briefcase, Banknote, PieChart, TrendingUp, CandlestickChart, Clock, Database, LayoutDashboard, FileText, Mail, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslationProvider } from "@/utils/providers/TranslationProvider";

export default function Home() {

  const { t } = useTranslationProvider()
  
  const titleProps = {
    backgroundImage: '/assets/backgrounds/agm-technology.jpg',
    logoSrc: '/assets/brand/agm-logo-white.png',
    title: t('agm-technology.title.title'),
    subtitle: t('agm-technology.title.subtitle'),
    ctaText: t('agm-technology.title.action_text'),
    ctaLink: '/apply'
  }

  const introductionProps = {
    title: t('agm-technology.introduction.title'),
    description: [
      t('agm-technology.introduction.description'),
      t('agm-technology.introduction.description_2')
    ],
    cards: [
      {
        title: t('agm-technology.introduction.cards.0.title'),
        description: t('agm-technology.introduction.cards.0.description'),
        items: [
          { icon: <BarChart2 />, label: 'Stocks' },
          { icon: <Briefcase />, label: 'ETFs' },
          { icon: <Banknote />, label: 'Bonds' },
          { icon: <PieChart />, label: 'Mutual Funds' },
          { icon: <TrendingUp />, label: 'Options' },
          { icon: <CandlestickChart />, label: 'Futures' }
        ]
      },
      {
        title: t('agm-technology.introduction.cards.1.title'),
        description: t('agm-technology.introduction.cards.1.description'),
        items: [
          { icon: <Clock />, label: t('agm-technology.introduction.cards.1.item_labels.0') },
          { icon: <Database />, label: t('agm-technology.introduction.cards.1.item_labels.1') },
          { icon: <LayoutDashboard />, label: t('agm-technology.introduction.cards.1.item_labels.2') },
          { icon: <FileText />, label: t('agm-technology.introduction.cards.1.item_labels.3') }
        ]
      },
      {
        title: t('agm-technology.introduction.cards.2.title'),
        description: t('agm-technology.introduction.cards.2.description'),
        items: [
          { icon: <Mail />, label: t('agm-technology.introduction.cards.2.item_labels.0') },
          { icon: <Phone />, label: t('agm-technology.introduction.cards.2.item_labels.1') },
          { icon: <MessageCircle />, label: t('agm-technology.introduction.cards.2.item_labels.2') }
        ]
      }
    ],
    actionText: t('agm-technology.introduction.action_text'),
    ctaLink: '/requirements'
  };

  const services = [
    {
      name: t('shared.services.agm_trader.title'),
      image: '/assets/backgrounds/agm-trader.jpg',
      description: t('shared.services.agm_trader.description'),
      url: '/trader'
    },
    {
      name: t('shared.services.agm_advisor.title'),
      image: '/assets/backgrounds/agm-advisor.webp',
      description: t('shared.services.agm_advisor.description'),
      url: '/advisor'
    },
    {
      name: t('shared.services.agm_institutional.title'),
      image: '/assets/backgrounds/agm-institutional.jpg',
      description: t('shared.services.agm_institutional.description'),
      url: '/institutional'
    }
  ]

  return (
    <motion.div 
      className="flex flex-col h-full w-full gap-y-20"
    >
      <Title {...titleProps} />
      <Introduction {...introductionProps} />
      <Services services={services} />
      <Team />
      <FAQ />
    </motion.div>
  )
}
