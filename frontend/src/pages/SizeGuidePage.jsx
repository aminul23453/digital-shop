// src/pages/SizeGuidePage.jsx
import React from 'react';
import { Ruler, WholeWord } from 'lucide-react'; // Icons for sizing

function SizeGuidePage() {
  // Placeholder data - replace with your actual size charts
  const mensTopsData = [
    { size: 'S', chest: '36-38"', waist: '28-30"', length: '27"' },
    { size: 'M', chest: '39-41"', waist: '31-33"', length: '28"' },
    { size: 'L', chest: '42-44"', waist: '34-36"', length: '29"' },
    { size: 'XL', chest: '45-47"', waist: '37-39"', length: '30"' },
    { size: 'XXL', chest: '48-50"', waist: '40-42"', length: '31"' },
  ];

  const womensTopsData = [
     { size: 'XS (US 0-2)', bust: '31-32"', waist: '24-25"', hip: '34-35"' },
     { size: 'S (US 4-6)', bust: '33-34"', waist: '26-27"', hip: '36-37"' },
     { size: 'M (US 8-10)', bust: '35-37"', waist: '28-30"', hip: '38-40"' },
     { size: 'L (US 12-14)', bust: '38-40"', waist: '31-33"', hip: '41-43"' },
     { size: 'XL (US 16-18)', bust: '41-43"', waist: '34-36"', hip: '44-46"' },
  ];

  const renderSizeTable = (title, data, headers) => (
   <section className="mb-10">
     <div className="text-center mb-6">
       <WholeWord className="h-10 w-10 text-primary mx-auto mb-3" />
       <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{title}</h2>
     </div>
     <div className="overflow-x-auto bg-card p-4 sm:p-6 rounded-lg shadow">
       <table className="min-w-full divide-y divide-border text-sm">
         <thead className="bg-muted/50">
           <tr>
             {headers.map((header) => (
               <th key={header} scope="col" className="px-4 py-3 text-left font-medium text-foreground tracking-wider">
                 {header}
               </th>
             ))}
           </tr>
         </thead>
         <tbody className="bg-background divide-y divide-border">
           {data.map((row, index) => (
             <tr key={index}>
               {headers.map((header) => (
                 <td key={header} className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                   {row[header.toLowerCase().replace(/\s+/g, '')] || row[header.toLowerCase()]} 
                 </td>
               ))}
             </tr>
           ))}
         </tbody>
       </table>
     </div>
     <p className="text-xs text-muted-foreground mt-3 text-center">
       *All measurements are in inches. Measurements may vary slightly by style.
     </p>
   </section>
  );


  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <Ruler className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Size Guide</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Find your perfect fit. Our guides help you choose the right size for ultimate comfort and style.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
         
         <section>
           <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">How to Measure</h2>
           </div>
           <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
             <p>To find your best fit, we recommend comparing your body measurements to our size charts. Here’s how to take your measurements:</p>
             <ul>
               <li><strong>Chest/Bust:</strong> Measure around the fullest part of your chest/bust, keeping the tape horizontal.</li>
               <li><strong>Waist:</strong> Measure around your natural waistline, typically the narrowest part of your torso.</li>
               <li><strong>Hips:</strong> Measure around the fullest part of your hips and seat, keeping the tape horizontal.</li>
               <li><strong>Length (for tops/dresses):</strong> Measure from the highest point of your shoulder down to the desired hemline.</li>
             </ul>
             <p className="text-sm">If you're between sizes, we generally recommend sizing up for a more relaxed fit or sizing down for a slimmer fit, depending on your preference and the garment's style.</p>
           </div>
         </section>

         {renderSizeTable("Men's Tops & T-Shirts", mensTopsData, ["Size", "Chest", "Waist", "Length"])}
         {renderSizeTable("Women's Tops & Dresses", womensTopsData, ["Size", "Bust", "Waist", "Hip"])}
         {/* Add more tables for bottoms, outerwear, etc. as needed */}

         <section className="text-center mt-10">
             <p className="text-muted-foreground">
                 Still unsure about your size? <a href="/contact-us" className="text-primary hover:underline">Contact our support team</a> for assistance!
             </p>
         </section>

        </div>
      </div>
    </div>
  );
}
// Need to import Link if not already imported from other usage
import { Link } from 'react-router-dom';
export default SizeGuidePage;