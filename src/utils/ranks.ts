import BronzeEmblem from '@/assets/tiers/emblems/Bronze.png'
import ChallengerEmblem from '@/assets/tiers/emblems/Challenger.png'
import DiamondEmblem from '@/assets/tiers/emblems/Diamond.png'
import GoldEmblem from '@/assets/tiers/emblems/Gold.png'
import MasterEmblem from '@/assets/tiers/emblems/Master.png'
import SilverEmblem from '@/assets/tiers/emblems/Silver.png'
import ProvisionalEmblem from '@/assets/tiers/emblems/provisional.png'

import BronzeWing from '@/assets/tiers/wings/Bronze.png'
import ChallengerWing from '@/assets/tiers/wings/Challenger.png'
import DiamondWing from '@/assets/tiers/wings/Diamond.png'
import GoldWing from '@/assets/tiers/wings/Gold.png'
import MasterWing from '@/assets/tiers/wings/Master.png'
import SilverWing from '@/assets/tiers/wings/Silver.png'
import { League } from '@/services/nest-api'

export type TierInfo = {
  emblem: string
  wing: string
  name: string
}

export const leaguesMap: Record<League, TierInfo> = {
  [League.Provisional]: {
    emblem: ProvisionalEmblem,
    wing: '',
    name: 'Unranked',
  },
  [League.Bronze]: {
    emblem: BronzeEmblem,
    wing: BronzeWing,
    name: 'Bronze',
  },
  [League.Silver]: {
    emblem: SilverEmblem,
    wing: SilverWing,
    name: 'Silver',
  },
  [League.Gold]: {
    emblem: GoldEmblem,
    wing: GoldWing,
    name: 'Gold',
  },
  [League.Diamond]: {
    emblem: DiamondEmblem,
    wing: DiamondWing,
    name: 'Diamond',
  },
  [League.Master]: {
    emblem: MasterEmblem,
    wing: MasterWing,
    name: 'Master',
  },
  [League.Challenger]: {
    emblem: ChallengerEmblem,
    wing: ChallengerWing,
    name: 'Challenger',
  },
}

export const divisionMap = {
  0: '',
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
}
