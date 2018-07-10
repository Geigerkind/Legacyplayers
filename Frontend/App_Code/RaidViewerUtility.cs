using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
 
namespace RPLL
{

    public struct ViewerData
    {
        public RaidData m_RaidData { get; set; }
        public int Id { get; set; }
        public int Uploader { get; set; }
        public int Attempt { get; set; }
        public int Category { get; set; }
        public int Target { get; set; }
        public int Source { get; set; }
        public int Lower { get; set; }
        public int Upper { get; set; }

        public int Start { get; set; }
        public int End { get; set; }

        public int Duration { get; set; }
    }

    // We might as well introduce RS_Sata here as default
    public struct QueryData
    {
        public int TimeStamp { get; set; }
        public int SourceId { get; set; }
        public int TargetId { get; set; }
        public int AbilityId { get; set; }
        public int TargetAbilityId { get; set; }
        public int Amount { get; set; }
        public short Type { get; set; }
    }

    public struct DataTableRow
    {
        public int Amount { get; set; }
        public int SourceId { get; set; }
        public int AbilityId { get; set; }
        public QueryData QueryData { get; set; }
    }

    public static class RaidViewerUtility
    {
        public static Dictionary<int, bool> m_WorldRaidBuffs = new Dictionary<int, bool>()
        {
            { 24870 ,true },
            { 11405 ,true },
            { 39627 ,true },
            { 41606 ,true },
            { 28520 ,true },
            { 41610 ,true },
            { 33272 ,true },
            { 41607 ,true },
            { 41609 ,true },
            { 46839 ,true },
            { 41611 ,true },
            { 11396 ,true },
            { 28518 ,true },
            { 41608 ,true },
            { 17627 ,true },
            { 46837 ,true },
            { 10278 ,true },
            { 1038 ,true },
            { 28497 ,true },
            { 13159 ,true },
            { 27142 ,true },
            { 11406 ,true },
            { 39439 ,true },
            { 27168 ,true },
            { 33257 ,true },
            { 33268 ,true },
            { 26990 ,true },
            { 27140 ,true },
            { 469 ,true },
            { 25389 ,true },
            { 38332 ,true },
            { 27144 ,true },
            { 26992 ,true },
            { 27152 ,true },
            { 33263 ,true },
            { 2048 ,true },
            { 27149 ,true },
            { 27141 ,true },
            { 27145 ,true },
            { 26991 ,true },
            { 27151 ,true },
            { 27127 ,true },
            { 25392 ,true },
            { 32223 ,true },
            { 5118 ,true },
            { 27143 ,true },
            { 25898 ,true },
            { 25895 ,true },
            { 39374 ,true },
            { 27150 ,true },
            { 27153 ,true },
            { 20218 ,true },
            { 24932 ,true },
            { 39441 ,true },
            { 16237 ,true },

            // Vanilla
            { 22730 ,true },
            { 17555 ,true },
            { 18191 ,true },
            { 25899 ,true },
            { 17628 ,true },
            { 18140 ,true },
            { 17635 ,true },
            { 10667 ,true },
            { 10668 ,true },
            { 10669 ,true },
            { 5907 ,true },
            { 22790 ,true },
            { 25804 ,true },
            { 18192 ,true },
            { 17573 ,true },
            { 17205 ,true },
            { 8914 ,true },
            { 17571 ,true },
            { 10157 ,true },
            { 19891  ,true },
            { 10957 ,true },
            { 10937 ,true },
            { 16884 ,true },
            { 25782 ,true },
            { 27683 ,true },
            { 14751 ,true },
            { 27681 ,true },
            { 9884 ,true },
            { 22789 ,true },
            { 21850 ,true },
            { 23028 ,true },
            { 21564 ,true },
            { 8990 ,true },
            { 25894 ,true },
            { 11766 ,true },
            { 17007 ,true },
            { 19746 ,true },
            { 10290 ,true },
            { 20906 ,true },
        };

        public static IEnumerable<RS_Damage> ApplySourceCondition(ref IEnumerable<RS_Damage> _Query, RaidData _RaidData, int Source, bool mergepets = false)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Source || (mergepets && _RaidData.m_SatReference[x.SatRefId].SourceId > 0 && Source == App.GetChar(_RaidData.m_SatReference[x.SatRefId].SourceId).OwnerId));
            return _Query;
        }
        public static IEnumerable<RS_Threat> ApplySourceCondition(ref IEnumerable<RS_Threat> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Source);
            return _Query;
        }
        public static IEnumerable<RS_Healing> ApplySourceCondition(ref IEnumerable<RS_Healing> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Source);
            return _Query;
        }
        private static IEnumerable<RS_Casts> ApplySourceCondition(ref IEnumerable<RS_Casts> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Source);
            return _Query;
        }
        public static IEnumerable<RS_Damage> ApplyTargetCondition(ref IEnumerable<RS_Damage> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Target);
            return _Query;
        }
        public static IEnumerable<RS_Threat> ApplyTargetCondition(ref IEnumerable<RS_Threat> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Target);
            return _Query;
        }
        public static IEnumerable<RS_Healing> ApplyTargetCondition(ref IEnumerable<RS_Healing> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Target);
            return _Query;
        }
        private static IEnumerable<RS_Casts> ApplyTargetCondition(ref IEnumerable<RS_Casts> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Target);
            return _Query;
        }
        private static IEnumerable<RS_Dispels> ApplySourceConditionSATA(ref IEnumerable<RS_Dispels> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId == Source);
            return _Query;
        }
        private static IEnumerable<RS_Interrupts> ApplySourceConditionSATA(ref IEnumerable<RS_Interrupts> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId == Source);
            return _Query;
        }
        private static IEnumerable<RS_Auras> ApplySourceConditionSA(ref IEnumerable<RS_Auras> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SaReference[x.SaRefId].SourceId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SaReference[x.SaRefId].SourceId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SaReference[x.SaRefId].SourceId == Source);
            return _Query;
        }
        private static IEnumerable<RS_Dispels> ApplyTargetConditionSATA(ref IEnumerable<RS_Dispels> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId == Target);
            return _Query;
        }
        private static IEnumerable<RS_Interrupts> ApplyTargetConditionSATA(ref IEnumerable<RS_Interrupts> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId == Target);
            return _Query;
        }
        public static IEnumerable<RS_Damage> ApplySourceConditionInverted(ref IEnumerable<RS_Damage> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Source);
            return _Query;
        }
        public static IEnumerable<RS_Threat> ApplySourceConditionInverted(ref IEnumerable<RS_Threat> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Source);
            return _Query;
        }
        public static IEnumerable<RS_Healing> ApplySourceConditionInverted(ref IEnumerable<RS_Healing> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Source);
            return _Query;
        }
        private static IEnumerable<RS_Casts> ApplySourceConditionInverted(ref IEnumerable<RS_Casts> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId == Source);
            return _Query;
        }
        public static IEnumerable<RS_Damage> ApplyTargetConditionInverted(ref IEnumerable<RS_Damage> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Target);
            return _Query;
        }
        public static IEnumerable<RS_Threat> ApplyTargetConditionInverted(ref IEnumerable<RS_Threat> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Target);
            return _Query;
        }
        public static IEnumerable<RS_Healing> ApplyTargetConditionInverted(ref IEnumerable<RS_Healing> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Target);
            return _Query;
        }
        private static IEnumerable<RS_Casts> ApplyTargetConditionInverted(ref IEnumerable<RS_Casts> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SatReference[x.SatRefId].SourceId == Target);
            return _Query;
        }
        private static IEnumerable<RS_Dispels> ApplySourceConditionInvertedSATA(ref IEnumerable<RS_Dispels> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId == Source);
            return _Query;
        }
        private static IEnumerable<RS_Interrupts> ApplySourceConditionInvertedSATA(ref IEnumerable<RS_Interrupts> _Query, RaidData _RaidData, int Source)
        {
            if (Source == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId >= 300000);
            else if (Source == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId < 300000);
            else if (Source > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].TargetId == Source);
            return _Query;
        }
        private static IEnumerable<RS_Dispels> ApplyTargetConditionInvertedSATA(ref IEnumerable<RS_Dispels> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId == Target);
            return _Query;
        }
        private static IEnumerable<RS_Interrupts> ApplyTargetConditionInvertedSATA(ref IEnumerable<RS_Interrupts> _Query, RaidData _RaidData, int Target)
        {
            if (Target == 1)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId >= 300000);
            else if (Target == 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId < 300000);
            else if (Target > 2)
                _Query = _Query.Where(x => _RaidData.m_SataReference[x.SataRefId].SourceId == Target);
            return _Query;
        }

        public static bool IsInAttempt(ref RS_Attempts[] me, int TS, int Length, ref int Count)
        {
            if (Count > Length || Count < 0 || Length < 0)
                return false;
            if (Count == Length)
                return me[Count].Start <= TS && TS <= me[Count].End;
            for (; Count < Length && TS > me[Count].End; ++Count) { }
            return me[Count].Start <= TS && TS <= me[Count].End;
        }
        private static IEnumerable<RS_Deaths> ApplyCategoryCondition(ref IEnumerable<RS_Deaths> _Query, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            return _Query.Where(x => IsInAttempt(ref atmtData, x.TimeStamp, length, ref count));
        }
        private static IEnumerable<RS_Dispels> ApplyCategoryCondition(ref IEnumerable<RS_Dispels> _Query, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            return _Query.Where(x => IsInAttempt(ref atmtData, x.TimeStamp, length, ref count));
        }
        private static IEnumerable<RS_Interrupts> ApplyCategoryCondition(ref IEnumerable<RS_Interrupts> _Query, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            return _Query.Where(x => IsInAttempt(ref atmtData, x.TimeStamp, length, ref count));
        }
        public static IEnumerable<RS_Healing> ApplyCategoryCondition(ref IEnumerable<RS_Healing> _Query, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            return _Query.Where(x => IsInAttempt(ref atmtData, x.TimeStamp, length, ref count));
        }
        private static IEnumerable<RS_Casts> ApplyCategoryCondition(ref IEnumerable<RS_Casts> _Query, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            return _Query.Where(x => IsInAttempt(ref atmtData, x.TimeStamp, length, ref count));
        }
        public static IEnumerable<RS_Damage> ApplyCategoryCondition(ref IEnumerable<RS_Damage> _Query, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            return _Query.Where(x => IsInAttempt(ref atmtData, x.TimeStamp, length, ref count));
        }
        public static IEnumerable<RS_Threat> ApplyCategoryCondition(ref IEnumerable<RS_Threat> _Query, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            return _Query.Where(x => IsInAttempt(ref atmtData, x.TimeStamp, length, ref count));
        }
        private static IEnumerable<RS_Auras> ApplyCategoryConditionAuras(ref IEnumerable<RS_Auras> _Query, short _Type, RaidData _RaidData, int Category, int Attempt, int expansion)
        {
            if (Attempt != 0) return _Query;
            var atmtData = _RaidData.GetFilterAttempts(expansion, Category);
            int count = 0;
            int length = atmtData.Length - 1;
            if (_Type == 1) _Query = _Query.Where(x => IsInAttempt(ref atmtData, x.Gained, length, ref count));
            else if (_Type == 3) _Query = _Query.Where(x => atmtData.Any(y => (y.Start <= x.Faded && y.End >= x.Faded) || (y.Start <= x.Gained && y.End >= x.Gained)));
            else _Query = _Query.Where(x => IsInAttempt(ref atmtData, x.Faded, length, ref count));
            return _Query;
        }

        // TODO
        // Assumes _Values is sorted ASC
        private static RS_Damage FilterDeathEvent(int _TS, int _SourceId, ref RS_Damage[] _Values, RaidData _RaidData)
        {
            for (int i = _Values.Length; --i >= 0;)
            {
                if (_RaidData.m_SatReference[_Values[i].SatRefId].TargetId == _SourceId && _Values[i].TimeStamp <= _TS)
                    return _Values[i];
            }
            return new RS_Damage()
            {
                SatRefId = 0,
                Amount = 0
            };
        }
        
        public static QueryData[] GetQuery(string _Name, RaidData _RaidData, int Lower, int Upper, int Source, int Target, int Category, int Attempt, int Expansion = 0,
            bool MergePets = true, bool DistIgnite = false, bool FilterIgnite = false, bool DistJudgement = false, bool FilterJudgement = false, bool FilterWorldRaidBuffs = false, bool FriendlyFire = false)
        {
            ulong key = Farmhash.Sharp.Farmhash.Hash64(string.Join(",", _Name, Lower, Upper, Source, Target, Category, Attempt, Expansion, MergePets,
                DistIgnite, FilterIgnite, DistJudgement, FilterJudgement, FilterWorldRaidBuffs, FriendlyFire));

            if (_RaidData.mQueryCache.ContainsKey(key))
                return _RaidData.mQueryCache[key];
            QueryData[] qData;
            switch (_Name)
            {
                case "Healing":
                    var q111 = _RaidData.m_Healing.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q111 = ApplySourceCondition(ref q111, _RaidData, Source);
                    q111 = ApplyTargetCondition(ref q111, _RaidData, Target);
                    q111 = ApplyCategoryCondition(ref q111, _RaidData, Category, Attempt, Expansion);
                    if (FilterJudgement)
                        q111 = q111.Where(x => _RaidData.m_SatReference[x.SatRefId].AbilityId != 28775);
                    if (!FilterJudgement && DistJudgement)
                    {
                        var qArr = q111.ToArray();
                        int sumIgnite = qArr.Where(x => _RaidData.m_SatReference[x.SatRefId].AbilityId == 28775).Sum(x => x.Amount);
                        // Copy paste from ignite here
                        Dictionary<int, double> mageFac = new Dictionary<int, double>();
                        // Initializing it with all paladins!
                        foreach (var dmg in qArr)
                        {
                            if (_RaidData.m_SatReference[dmg.SatRefId].AbilityId != 19942) continue;
                            if (!mageFac.ContainsKey(_RaidData.m_SatReference[dmg.SatRefId].SourceId))
                                mageFac[_RaidData.m_SatReference[dmg.SatRefId].SourceId] = 0;
                        }
                        foreach (var dmg in qArr)
                        {
                            if (_RaidData.m_SatReference[dmg.SatRefId].AbilityId != 28775) continue;
                            if (mageFac.ContainsKey(_RaidData.m_SatReference[dmg.SatRefId].SourceId))
                                mageFac[_RaidData.m_SatReference[dmg.SatRefId].SourceId] += dmg.Amount;
                            else
                                mageFac[_RaidData.m_SatReference[dmg.SatRefId].SourceId] = dmg.Amount;
                        }
                        double igniteMedian = 1.0 * sumIgnite / mageFac.Count;
                        Dictionary<int, double> mageFacCopy = new Dictionary<int, double>(mageFac);
                        foreach (var mF in mageFacCopy)
                            mageFac[mF.Key] = igniteMedian / mF.Value;
                        qData = q111.Select(x => new QueryData()
                        {
                            TimeStamp = x.TimeStamp,
                            SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId,
                            AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId,
                            Amount = (_RaidData.m_SatReference[x.SatRefId].AbilityId == 28775 ? (int)(x.Amount * mageFac[_RaidData.m_SatReference[x.SatRefId].SourceId]) : x.Amount),
                            TargetId = _RaidData.m_SatReference[x.SatRefId].TargetId,
                            Type = x.Type
                        }).ToArray();
                        if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                        return qData;
                    }
                    qData = q111.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount, Type = (short)(x.HitType/10), TargetId = _RaidData.m_SatReference[x.SatRefId].TargetId }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;

                case "Healing taken":
                    var q112 = _RaidData.m_Healing.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q112 = ApplySourceConditionInverted(ref q112, _RaidData, Source);
                    q112 = ApplyTargetConditionInverted(ref q112, _RaidData, Target);
                    q112 = ApplyCategoryCondition(ref q112, _RaidData, Category, Attempt, Expansion);
                    if (FilterJudgement)
                        q112 = q112.Where(x => _RaidData.m_SatReference[x.SatRefId].AbilityId != 28775);
                    // Doesnt make sense to dist judement here o.o
                    qData = q112.Select(x => new QueryData()
                    {
                        TimeStamp = x.TimeStamp,
                        SourceId = _RaidData.m_SatReference[x.SatRefId].TargetId,
                        AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId,
                        Amount = x.Amount,
                        Type = x.Type,
                        TargetId = _RaidData.m_SatReference[x.SatRefId].SourceId
                    }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Effective Healing Output":
                    var q113 = _RaidData.m_Healing.Values.Where(x => x.HitType < 10 && x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q113 = ApplySourceCondition(ref q113, _RaidData, Source);
                    q113 = ApplyTargetCondition(ref q113, _RaidData, Target);
                    q113 = ApplyCategoryCondition(ref q113, _RaidData, Category, Attempt, Expansion);

                    var q114 = _RaidData.m_Damage.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q114 = ApplySourceConditionInverted(ref q114, _RaidData, Source);
                    q114 = ApplyTargetConditionInverted(ref q114, _RaidData, Target);
                    q114 = ApplyCategoryCondition(ref q114, _RaidData, Category, Attempt, Expansion);
                    
                    if (FilterJudgement)
                        q113 = q113.Where(x => _RaidData.m_SatReference[x.SatRefId].AbilityId != 28775);

                    // TODO: Up there the implementation
                    // The idea is basically to find a damage taken value and associate it to a healing value
                    var q113Arr = q113.GroupBy(x => _RaidData.m_SatReference[x.SatRefId].SourceId).Select(x => new Tuple<int, RS_Healing[]>(x.Key, x.ToArray())).ToArray();
                    var q114Arr = q114.GroupBy(x => _RaidData.m_SatReference[x.SatRefId].TargetId).ToArray();
                    
                    List<RS_Healing> flattenedList = new List<RS_Healing>();
                    for (int q113Count = 0; q113Count < q113Arr.Length; ++q113Count)
                    {
                        int q114UserIndex = -1;

                        // Find index of this player in the heal arr
                        // Note he may as well not exist!
                        for (int q114Count = 0; q114Count < q114Arr.Length; ++q114Count)
                        {
                            if (q114Arr[q114Count].Key == q113Arr[q113Count].Item1)
                            {
                                q114UserIndex = q114Count;
                                break;
                            }
                        }

                        if (q114UserIndex == -1)
                        {
                            // Now we need to flatten the list again!
                            foreach (var heal in q113Arr[q113Count].Item2)
                                flattenedList.Add(heal);
                            continue;
                        }
                        
                        int innerCount = 0;
                        foreach (var dmgValue in q114Arr[q114UserIndex])
                        {
                            // If the timestamp is lower, iterate until we find a higher one
                            for (; innerCount < q113Arr[q113Count].Item2.Length - 1; ++innerCount)
                            {
                                if (q113Arr[q113Count].Item2[innerCount].TimeStamp >= dmgValue.TimeStamp)
                                    break;
                            }

                            q113Arr[q113Count].Item2[innerCount].Amount -= dmgValue.Amount;
                        }

                        // Now we need to flatten the list again!
                        foreach (var heal in q113Arr[q113Count].Item2)
                            flattenedList.Add(heal);
                    }
                    
                    return flattenedList.OrderBy(x => x.TimeStamp).Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount, Type = (short)(x.HitType / 10), TargetId = _RaidData.m_SatReference[x.SatRefId].TargetId }).ToArray();
                case "Efficient healing":
                    var q1 = _RaidData.m_Healing.Values.Where(x => x.Type == 0 && x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q1 = ApplySourceCondition(ref q1, _RaidData, Source);
                    q1 = ApplyTargetCondition(ref q1, _RaidData, Target);
                    q1 = ApplyCategoryCondition(ref q1, _RaidData, Category, Attempt, Expansion);
                    return q1.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount }).ToArray();
                case "Raw healing":
                    var q3 = _RaidData.m_Healing.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q3 = ApplySourceCondition(ref q3, _RaidData, Source);
                    q3 = ApplyTargetCondition(ref q3, _RaidData, Target);
                    q3 = ApplyCategoryCondition(ref q3, _RaidData, Category, Attempt, Expansion);
                    return q3.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount }).ToArray();
                case "Overhealing":
                    var q4 = _RaidData.m_Healing.Values.Where(x => x.Type == 1 && x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q4 = ApplySourceCondition(ref q4, _RaidData, Source);
                    q4 = ApplyTargetCondition(ref q4, _RaidData, Target);
                    q4 = ApplyCategoryCondition(ref q4, _RaidData, Category, Attempt, Expansion);
                    return q4.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount }).ToArray();
                case "Efficient healing taken":
                    var q5 = _RaidData.m_Healing.Values.Where(x => x.Type == 0 && x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q5 = ApplySourceConditionInverted(ref q5, _RaidData, Source);
                    q5 = ApplyTargetConditionInverted(ref q5, _RaidData, Target);
                    q5 = ApplyCategoryCondition(ref q5, _RaidData, Category, Attempt, Expansion);
                    return q5.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].TargetId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount }).ToArray();
                case "Raw healing taken":
                    var q6 = _RaidData.m_Healing.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q6 = ApplySourceConditionInverted(ref q6, _RaidData, Source);
                    q6 = ApplyTargetConditionInverted(ref q6, _RaidData, Target);
                    q6 = ApplyCategoryCondition(ref q6, _RaidData, Category, Attempt, Expansion);
                    return q6.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].TargetId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount }).ToArray();
                case "Overhealing taken":
                    var q7 = _RaidData.m_Healing.Values.Where(x => x.Type == 1 && x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q7 = ApplySourceConditionInverted(ref q7, _RaidData, Source);
                    q7 = ApplyTargetConditionInverted(ref q7, _RaidData, Target);
                    q7 = ApplyCategoryCondition(ref q7, _RaidData, Category, Attempt, Expansion);
                    return q7.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].TargetId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount }).ToArray();
                case "Damage taken":
                    var q2 = _RaidData.m_Damage.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q2 = ApplySourceConditionInverted(ref q2, _RaidData, Source);
                    q2 = ApplyTargetConditionInverted(ref q2, _RaidData, Target);
                    q2 = ApplyCategoryCondition(ref q2, _RaidData, Category, Attempt, Expansion);
                    return q2.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SatReference[x.SatRefId].TargetId, AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId, Amount = x.Amount,Type = x.HitType }).ToArray();
                case "Deaths":
                    var q8 = _RaidData.m_Deaths.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    if (Source == 1)
                        q8 = q8.Where(x => x.SourceId >= 300000);
                    else if (Source == 2)
                        q8 = q8.Where(x => x.SourceId < 300000);
                    else if (Source > 2)
                        q8 = q8.Where(x => x.SourceId == Source);
                    q8 = ApplyCategoryCondition(ref q8, _RaidData, Category, Attempt, Expansion);
                    // TODO: Its slow as fuck!
                    var enumer = _RaidData.m_Damage.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    enumer = ApplySourceConditionInverted(ref enumer, _RaidData, Source);
                    var dmgvalues = ApplyCategoryCondition(ref enumer, _RaidData, Category, Attempt, Expansion).ToArray();
                    qData = q8.Select(x =>
                    {
                        var firstOrDefault = FilterDeathEvent(x.TimeStamp, x.SourceId, ref dmgvalues, _RaidData);
                        return new QueryData()
                        {
                            TimeStamp = x.TimeStamp,
                            SourceId = x.SourceId,
                            TargetId = _RaidData.m_SatReference[firstOrDefault.SatRefId].SourceId,
                            AbilityId = _RaidData.m_SatReference[firstOrDefault.SatRefId].AbilityId,
                            Amount = firstOrDefault.Amount
                        };
                    }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Interrupts":
                    var q9 = _RaidData.m_Interrupts.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q9 = ApplySourceConditionSATA(ref q9, _RaidData, Source);
                    q9 = ApplyTargetConditionSATA(ref q9, _RaidData, Target);
                    q9 = ApplyCategoryCondition(ref q9, _RaidData, Category, Attempt, Expansion);
                    qData = q9.Select(x => new QueryData()
                    {
                        TimeStamp = x.TimeStamp,
                        SourceId = (MergePets && App.GetChar(_RaidData.m_SataReference[x.SataRefId].SourceId).OwnerId > 0
                            ? App.GetChar(_RaidData.m_SataReference[x.SataRefId].SourceId).OwnerId
                            : _RaidData.m_SataReference[x.SataRefId].SourceId),
                        AbilityId = _RaidData.m_SataReference[x.SataRefId].AbilityId,
                        Amount = 1,
                        TargetId = _RaidData.m_SataReference[x.SataRefId].TargetId,
                        TargetAbilityId = _RaidData.m_SataReference[x.SataRefId].TargetAbilityId
                    }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Dispels":
                    var q10 = _RaidData.m_Dispels.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q10 = ApplySourceConditionSATA(ref q10, _RaidData, Source);
                    q10 = ApplyTargetConditionSATA(ref q10, _RaidData, Target);
                    q10 = ApplyCategoryCondition(ref q10, _RaidData, Category, Attempt, Expansion);
                    qData = q10.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SataReference[x.SataRefId].SourceId, AbilityId = _RaidData.m_SataReference[x.SataRefId].AbilityId, Amount = 1, TargetId = _RaidData.m_SataReference[x.SataRefId].TargetId, TargetAbilityId = _RaidData.m_SataReference[x.SataRefId].TargetAbilityId }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Dispels received":
                    var q11 = _RaidData.m_Dispels.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q11 = ApplySourceConditionInvertedSATA(ref q11, _RaidData, Source);
                    q11 = ApplyTargetConditionInvertedSATA(ref q11, _RaidData, Target);
                    q11 = ApplyCategoryCondition(ref q11, _RaidData, Category, Attempt, Expansion);
                    qData = q11.Select(x => new QueryData() { TimeStamp = x.TimeStamp, SourceId = _RaidData.m_SataReference[x.SataRefId].TargetId, AbilityId = _RaidData.m_SataReference[x.SataRefId].TargetAbilityId, Amount = 1, TargetId = _RaidData.m_SataReference[x.SataRefId].SourceId, TargetAbilityId = _RaidData.m_SataReference[x.SataRefId].AbilityId }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Auras gained":
                    var q12 = _RaidData.m_Auras.Values.Where(x => x.Gained >= Lower && x.Gained <= Upper);
                    q12 = ApplySourceConditionSA(ref q12, _RaidData, Source);
                    q12 = ApplyCategoryConditionAuras(ref q12, 1, _RaidData, Category, Attempt, Expansion);
                    if (FilterWorldRaidBuffs)
                        q12 = q12.Where(x => !m_WorldRaidBuffs.ContainsKey(_RaidData.m_SaReference[x.SaRefId].AbilityId));
                    qData = q12.Select(x => new QueryData() { TimeStamp = x.Gained, SourceId = _RaidData.m_SaReference[x.SaRefId].SourceId, AbilityId = _RaidData.m_SaReference[x.SaRefId].AbilityId, Amount = 1 }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Auras faded":
                    var q13 = _RaidData.m_Auras.Values.Where(x => x.Faded >= Lower && x.Faded <= Upper);
                    q13 = ApplySourceConditionSA(ref q13, _RaidData, Source);
                    q13 = ApplyCategoryConditionAuras(ref q13, 2, _RaidData, Category, Attempt, Expansion);
                    if (FilterWorldRaidBuffs)
                        q13 = q13.Where(x => !m_WorldRaidBuffs.ContainsKey(_RaidData.m_SaReference[x.SaRefId].AbilityId));
                    qData = q13.Select(x => new QueryData() { TimeStamp = x.Faded, SourceId = _RaidData.m_SaReference[x.SaRefId].SourceId, AbilityId = _RaidData.m_SaReference[x.SaRefId].AbilityId, Amount = 1 }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Aura uptime":
                    var q14 = _RaidData.m_Auras.Values.Where(x => x.Gained <= Upper && x.Faded >= Lower);
                    q14 = ApplySourceConditionSA(ref q14, _RaidData, Source);
                    q14 = ApplyCategoryConditionAuras(ref q14, 3, _RaidData, Category, Attempt, Expansion);
                    if (FilterWorldRaidBuffs)
                        q14 = q14.Where(x => !m_WorldRaidBuffs.ContainsKey(_RaidData.m_SaReference[x.SaRefId].AbilityId));
                    // x.Faded - x.Gained => Comparing it with the duration to estimate the uptime!
                    // If x.Faded > as the max attempt time, we need to decrease it!
                    qData = q14.Select(x => new QueryData() { TimeStamp = (x.Faded > Upper ? Upper : x.Faded) - (x.Gained < Lower ? Lower : x.Gained), SourceId = _RaidData.m_SaReference[x.SaRefId].SourceId, AbilityId = _RaidData.m_SaReference[x.SaRefId].AbilityId, Amount = (x.Gained < Lower ? Lower : x.Gained) }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Aura active":
                    var q15 = _RaidData.m_Auras.Values.Where(x => x.Gained <= Upper && x.Faded >= Lower);
                    q15 = ApplySourceConditionSA(ref q15, _RaidData, Source);
                    q15 = ApplyCategoryConditionAuras(ref q15, 3, _RaidData, Category, Attempt, Expansion);
                    if (FilterWorldRaidBuffs)
                        q15 = q15.Where(x => !m_WorldRaidBuffs.ContainsKey(_RaidData.m_SaReference[x.SaRefId].AbilityId));
                    // x.Faded - x.Gained => Comparing it with the duration to estimate the uptime!
                    // If x.Faded > as the max attempt time, we need to decrease it!
                    qData = q15.Select(x => new QueryData() { TimeStamp = (x.Faded > Upper ? Upper : x.Faded), SourceId = _RaidData.m_SaReference[x.SaRefId].SourceId, AbilityId = _RaidData.m_SaReference[x.SaRefId].AbilityId, Amount = (x.Gained < Lower ? Lower : x.Gained) }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Casts":
                    var q16 = _RaidData.m_Casts.Values.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q16 = ApplySourceCondition(ref q16, _RaidData, Source);
                    q16 = ApplyTargetCondition(ref q16, _RaidData, Target);
                    q16 = ApplyCategoryCondition(ref q16, _RaidData, Category, Attempt, Expansion);
                    qData = q16.Select(x => new QueryData()
                    {
                        TimeStamp = x.TimeStamp,
                        SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId,
                        AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId,
                        Amount = x.Amount
                    }).ToArray();
                    if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                    return qData;
                case "Threat":
                    var q17 = _RaidData.m_Threat.Where(x => x.TimeStamp >= Lower && x.TimeStamp <= Upper);
                    q17 = ApplySourceCondition(ref q17, _RaidData, Source);
                    q17 = ApplyTargetCondition(ref q17, _RaidData, Target);
                    q17 = ApplyCategoryCondition(ref q17, _RaidData, Category, Attempt, Expansion);
                    qData = q17.Select(x => new QueryData()
                    {
                        TimeStamp = x.TimeStamp,
                        SourceId = _RaidData.m_SatReference[x.SatRefId].SourceId,
                        AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId,
                        Amount = Convert.ToInt32(x.Amount/100.0),
                    }).ToArray();
                    return qData;
            }
            
            var q = _RaidData.m_Damage.Where(x => x.Value.TimeStamp >= Lower && x.Value.TimeStamp <= Upper && _RaidData.m_SatReference[x.Value.SatRefId].SourceId != _RaidData.m_SatReference[x.Value.SatRefId].TargetId).Select(x => x.Value);
            q = ApplySourceCondition(ref q, _RaidData, Source, MergePets);
            q = ApplyTargetCondition(ref q, _RaidData, Target);
            q = ApplyCategoryCondition(ref q, _RaidData, Category, Attempt, Expansion);

            //HttpContext.Current.Response.Write(q.Count()+"<br />");

            if (!FriendlyFire)
            {
                // That will slow it down lots!
                q = q.Where(x => _RaidData.m_SatReference[x.SatRefId].TargetId < 300000 &&
                                 ((App.GetNpc(_RaidData.m_SatReference[x.SatRefId].TargetId).Liking == 0 || _RaidData.m_SatReference[x.SatRefId].TargetId == 13020 ||
                                  (_RaidData.m_SatReference[x.SatRefId].SourceId >= 300000 &&
                                   (App.GetChar(_RaidData.m_SatReference[x.SatRefId].SourceId).Faction !=
                                    App.GetNpc(_RaidData.m_SatReference[x.SatRefId].TargetId).Liking &&
                                    App.GetChar(_RaidData.m_SatReference[x.SatRefId].SourceId).Faction + 2 !=
                                    App.GetNpc(_RaidData.m_SatReference[x.SatRefId].TargetId).Liking)))
                                 || (_RaidData.m_SatReference[x.SatRefId].SourceId < 300000 &&
                                     _RaidData.m_SatReference[x.SatRefId].SourceId !=
                                     _RaidData.m_SatReference[x.SatRefId].TargetId))
                                  
                );
            }

            //HttpContext.Current.Response.Write(q.Count() + "<br />");

            if (FilterIgnite)
            {
                q = q.Where(x => _RaidData.m_SatReference[x.SatRefId].AbilityId != 11120 && _RaidData.m_SatReference[x.SatRefId].AbilityId != 105550);
            }

            //HttpContext.Current.Response.Write(q.Count() + "<br />");

            if (!FilterIgnite && DistIgnite)
            {
                var qArr = q.ToArray();
                int sumIgnite = qArr.Where(x => _RaidData.m_SatReference[x.SatRefId].AbilityId == 11120 || _RaidData.m_SatReference[x.SatRefId].AbilityId == 105550).Sum(x => x.Amount);
                // Retrieve for each mage a factor at which their damage is reduced!
                Dictionary<int, double> mageFac = new Dictionary<int, double>();
                // Initializing it with all mages!
                foreach (var dmg in qArr)
                {
                    if (_RaidData.m_SatReference[dmg.SatRefId].AbilityId != 10150 && _RaidData.m_SatReference[dmg.SatRefId].AbilityId != 11120 && _RaidData.m_SatReference[dmg.SatRefId].AbilityId != 105550) continue;
                    if (!mageFac.ContainsKey(_RaidData.m_SatReference[dmg.SatRefId].SourceId))
                        mageFac[_RaidData.m_SatReference[dmg.SatRefId].SourceId] = 0;
                }

                foreach (var dmg in qArr)
                {
                    if (_RaidData.m_SatReference[dmg.SatRefId].AbilityId != 11120 && _RaidData.m_SatReference[dmg.SatRefId].AbilityId != 105550) continue;
                    if (mageFac.ContainsKey(_RaidData.m_SatReference[dmg.SatRefId].SourceId))
                        mageFac[_RaidData.m_SatReference[dmg.SatRefId].SourceId] += dmg.Amount;
                    else
                        mageFac[_RaidData.m_SatReference[dmg.SatRefId].SourceId] = dmg.Amount;
                }
                double igniteMedian = 1.0 * sumIgnite / mageFac.Count;
                Dictionary<int, double> mageFacCopy = new Dictionary<int, double>(mageFac);
                foreach (var mF in mageFacCopy)
                    mageFac[mF.Key] = igniteMedian / mF.Value;

                qData = qArr.Select(x => new QueryData()
                {
                    TimeStamp = x.TimeStamp,
                    SourceId = (MergePets && App.GetChar(_RaidData.m_SatReference[x.SatRefId].SourceId).OwnerId > 0
                        ? App.GetChar(_RaidData.m_SatReference[x.SatRefId].SourceId).OwnerId
                        : _RaidData.m_SatReference[x.SatRefId].SourceId),
                    AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId,
                    Amount = (_RaidData.m_SatReference[x.SatRefId].AbilityId == 11120 || _RaidData.m_SatReference[x.SatRefId].AbilityId == 105550 ? (int)(x.Amount * mageFac[_RaidData.m_SatReference[x.SatRefId].SourceId]) : x.Amount),
                    Type = x.HitType
                }).ToArray();
                if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;
                return qData;
            }

            //HttpContext.Current.Response.Write(q.Count() + "<br />");

            qData = q.Select(x => new QueryData()
            {
                TimeStamp = x.TimeStamp,
                SourceId = (MergePets && App.GetChar(_RaidData.m_SatReference[x.SatRefId].SourceId).OwnerId > 0
                    ? App.GetChar(_RaidData.m_SatReference[x.SatRefId].SourceId).OwnerId
                    : _RaidData.m_SatReference[x.SatRefId].SourceId),
                AbilityId = _RaidData.m_SatReference[x.SatRefId].AbilityId,
                Amount = x.Amount,
                Type = x.HitType
            }).ToArray();

            //HttpContext.Current.Response.Write(qData.Count() + "<br />");

            if (!_RaidData.mQueryCache.ContainsKey(key)) _RaidData.mQueryCache[key] = qData;

            //HttpContext.Current.Response.Write(qData.Count() + "<br />");
            return qData;
        }
    }
}