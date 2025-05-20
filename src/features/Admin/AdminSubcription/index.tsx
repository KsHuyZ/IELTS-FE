"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ESubcription } from "@/types/auth";
import { setStorage } from "@/utils/storage";
import { useAuthStore } from "@/store/auth";

interface PricingFeature {
  text: string;
}

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
  footerText?: string;
  footerLink?: {
    text: string;
    href: string;
  };
}

export default function AdminSubcription() {
  const pricingTiers: PricingTier[] = [
    {
      id: ESubcription.Free,
      name: "Free",
      price: 0,
      description: "Start your IELTS preparation with basic practice tools",
      buttonText: "Upgrade to Free",
      features: [
        { text: "Accept access to do exams and practice" },
        { text: "No support for writing and grading" },
      ],
      footerText: "Already on this plan? ",
      footerLink: {
        text: "View billing support",
        href: "#",
      },
    },
    {
      id: ESubcription.Plus,
      name: "Plus",
      price: 100000,
      description:
        "Boost your IELTS score with more practice and detailed feedback",
      buttonText: "Upgrade to Plus",
      popular: true,
      features: [
        { text: "All features in Free plan" },
        { text: "Limited access to written assignments and grading" },
      ],
      footerLink: {
        text: "Subject to usage limits",
        href: "#",
      },
    },
    {
      id: ESubcription.Pro,
      name: "Pro",
      price: 200000,
      description:
        "Maximize your IELTS potential with unlimited practice and premium support",
      buttonText: "Upgrade to Pro",
      features: [
        { text: "All features in Plus plan" },
        { text: "Unlimited access to written assignments and grading" },
      ],
      footerText: "Unlimited access subject to fair use policies. ",
      footerLink: {
        text: "Learn more",
        href: "#",
      },
    },
  ];
  const formatVND = (number: number) => {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  return (
    <div className="h-full p-8 gap-14">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`bg-white border-gray-700 text-black h-[500px] flex flex-col ${
                tier.popular ? "ring-2 ring-green-500" : ""
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold">
                    {tier.name}
                  </CardTitle>
                  {tier.popular && (
                    <Badge className="bg-[#188F09] text-white text-xs uppercase">
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {formatVND(tier.price)}
                  </span>
                  <span className="ml-1 text-sm font-medium text-gray-400">
                    /
                    <br />
                    tháng
                  </span>
                </div>
                <CardDescription className="text-black mt-2">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-black">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              {(tier.footerText || tier.footerLink) && (
                <CardFooter className="pt-4 border-t border-gray-800 mt-auto">
                  <div className="text-xs text-gray-400">
                    {tier.footerText}
                    {tier.footerLink && (
                      <a
                        href={tier.footerLink.href}
                        className="text-black underline hover:text-white"
                      >
                        {tier.footerLink.text}
                      </a>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
