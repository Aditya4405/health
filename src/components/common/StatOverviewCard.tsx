import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface StatOverviewCardProps {
  title: string;
  value: string;
  subtext?: string;
  trend?: string;
  tone?: 'teal' | 'coral' | 'blue' | 'purple';
  icon?: ReactNode;
}

const toneMap = {
  teal: 'text-teal',
  coral: 'text-coral',
  blue: 'text-primary',
  purple: 'text-purple',
};

export const StatOverviewCard = ({ title, value, subtext, trend, tone = 'blue', icon }: StatOverviewCardProps) => (
  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
    <Card className="card-hover">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <p className="text-sm text-[#5f7388]">{title}</p>
          {icon}
        </div>
        <p className={cn('font-display text-3xl font-bold', toneMap[tone])}>{value}</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          {trend && (
            <span className="inline-flex items-center gap-1 text-[#1d9e75]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {trend}
            </span>
          )}
          {subtext && <span className="text-[#5f7388]">{subtext}</span>}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);


