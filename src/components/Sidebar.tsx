"use client"
import Link from "next/link"
import React from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { useTranslationProvider } from "@/utils/providers/TranslationProvider"
import { formatURL } from "@/utils/language/lang"
import { X } from "lucide-react"
import LanguageSwitcher from "./misc/LanguageSwitcher"

interface Props {
  setExpandSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({ setExpandSidebar }: Props) => {

  const { lang, t } = useTranslationProvider()

  const navbarContent = [
    { name: 'AGM Home', url: '/' },
    { name: t('sidebar.apply'), url: '/apply' },
  ]

  return (
    <div>
      <div className='fixed inset-0 bg-black bg-opacity-50 z-40' onClick={() => setExpandSidebar(false)} />
      <motion.div
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        exit={{ x: 500 }}
        transition={{ duration: 0.2, type: "spring", bounce: 0 }}
        className='z-50 fixed right-0 top-0 w-fit h-full bg-background shadow-lg'
      >
        <NavigationMenu className="h-full w-full flex flex-col justify-between p-5">
          <NavigationMenuList className="w-full py-4 flex flex-col items-end justify-end gap-4">
            <Button className="w-fit p-2" variant='ghost' onClick={() => setExpandSidebar(false)}>
                <X className="w-6 h-6"/>
            </Button>
            <NavigationMenuItem className="flex w-full text-end justify-end items-end">
              <LanguageSwitcher />
            </NavigationMenuItem>
            {navbarContent.map((item, index) => (
              <NavigationMenuItem key={index} onClick={() => setExpandSidebar(false)} className="w-full text-end">
                <Link href={formatURL(item.url, lang)} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "justify-end")}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            
          </NavigationMenuList>
        </NavigationMenu>
      </motion.div>
    </div>

  )
}

export default Sidebar