import ProvisionalEmblem from '@/assets/tiers/emblems/provisional.png'
import BronzeEmblem from '@/assets/tiers/emblems/Bronze.png'
import SilverEmblem from '@/assets/tiers/emblems/Silver.png'
import GoldEmblem from '@/assets/tiers/emblems/Gold.png'
import DiamondEmblem from '@/assets/tiers/emblems/Diamond.png'
import MasterEmblem from '@/assets/tiers/emblems/Master.png'
import ChallengerEmblem from '@/assets/tiers/emblems/Challenger.png'

import BronzeWing from '@/assets/tiers/wings/Bronze.png'
import SilverWing from '@/assets/tiers/wings/Silver.png'
import GoldWing from '@/assets/tiers/wings/Gold.png'
import DiamondWing from '@/assets/tiers/wings/Diamond.png'
import MasterWing from '@/assets/tiers/wings/Master.png'
import ChallengerWing from '@/assets/tiers/wings/Challenger.png'
import { Tier } from '@/hooks/use-rating-info'

export type Division = 1 | 2 | 3 | 4

export type TierInfo = {
  emblem: string
  wing: string
  name: string
}

export const tiersMap: Record<Tier, TierInfo> = {
  [Tier.Provisional]: {
    emblem: ProvisionalEmblem,
    wing: '',
    name: 'Unranked',
  },
  [Tier.Bronze]: {
    emblem: BronzeEmblem,
    wing: BronzeWing,
    name: 'Bronze',
  },
  [Tier.Silver]: {
    emblem: SilverEmblem,
    wing: SilverWing,
    name: 'Silver',
  },
  [Tier.Gold]: {
    emblem: GoldEmblem,
    wing: GoldWing,
    name: 'Gold',
  },
  [Tier.Diamond]: {
    emblem: DiamondEmblem,
    wing: DiamondWing,
    name: 'Diamond',
  },
  [Tier.Master]: {
    emblem: MasterEmblem,
    wing: MasterWing,
    name: 'Master',
  },
  [Tier.Challenger]: {
    emblem: ChallengerEmblem,
    wing: ChallengerWing,
    name: 'Challenger',
  },
}
