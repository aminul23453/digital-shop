// src/pages/FaqPage.jsx
import React from 'react';
import { HelpCircle } from 'lucide-react'; // ChevronDown is usually part of Shadcn's AccordionTrigger
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // Assuming Shadcn accordion is here

const faqData = [
  {
    id: 'q1',
    question: 'What materials do you use?',
    answer:
      'We prioritize sustainable and eco-friendly materials such as organic cotton, Tencel™, recycled polyester, hemp, and linen. Each product page details the specific materials used.',
  },
  {
    id: 'q2',
    question: 'Are your products ethically made?',
    answer:
      'Absolutely. Ethical manufacturing is a core value at EcoThreads. We partner with certified factories that ensure fair wages, safe working conditions, and respect for all workers. You can learn more on our Ethical Manufacturing page.',
  },
  {
    id: 'q3',
    question: 'How do I care for my EcoThreads garments?',
    answer:
      'Care instructions vary by material. Generally, we recommend washing in cold water, using eco-friendly detergents, and line drying when possible to extend the life of your garment and reduce energy consumption. Specific care instructions are available on each product page and garment label.',
  },
  {
    id: 'q4',
    question: 'What is your shipping policy?',
    answer:
      'We offer standard and expedited shipping options. Shipping times and costs vary by location. We strive to use eco-friendly packaging materials for all our shipments. More details can be found on our Shipping & Returns page.',
  },
  {
    id: 'q5',
    question: 'What is your return and exchange policy?',
    answer:
      'We want you to love your EcoThreads purchase. We accept returns and exchanges on unworn items with tags attached within 30 days of receipt. Please visit our Shipping & Returns page for detailed instructions.',
  },
];

function FaqPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Corrected Hero Section with Emerald/Green Theme */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <HelpCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" /> {/* Changed to emerald */}
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Frequently Asked Questions</h1> {/* Changed to emerald */}
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto"> {/* Changed to emerald */}
            Have questions? We've got answers. Find information about our products, policies, and practices.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          {faqData.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqData.map((faqItem) => (
                <AccordionItem value={faqItem.id} key={faqItem.id} className="border-border bg-card rounded-md px-1">
                  <AccordionTrigger className="text-left hover:no-underline px-4 py-3 text-base font-medium text-foreground">
                    {faqItem.question}
                    {/* Default Shadcn AccordionTrigger includes a Chevron icon.
                        If you needed to override it, it would be something like:
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-auto group-data-[state=open]:rotate-180" /> 
                    */}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 text-muted-foreground">
                    {faqItem.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-muted-foreground">No FAQs available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FaqPage;