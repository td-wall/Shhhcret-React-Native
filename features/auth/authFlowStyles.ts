import { StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Space } from '../../constants/tokens';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  keyboard: {
    flex: 1,
  },

  // ── TopBar ──────────────────────────────────────────────
  topBar: {
    height: 54,
    paddingHorizontal: Space.s4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backSlot: {
    width: 38,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.ink100,
  },
  progressDotActive: {
    width: 22,
    backgroundColor: Colors.ink1000,
  },
  progressDotPast: {
    backgroundColor: Colors.ink300,
  },

  // ── Intro Screen ─────────────────────────────────────────
  introScreen: {
    flex: 1,
    paddingHorizontal: 28,
  },
  introBrandBar: {
    paddingTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  introBrandName: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: Colors.text,
  },
  introBrandMission: {
    marginLeft: 'auto',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: Colors.text3,
  },
  introHero: {
    flex: 1,
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.3,
    lineHeight: 42,
    color: Colors.text,
  },
  introDesc: {
    marginTop: 18,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.15,
    color: Colors.text2,
  },
  introActions: {
    paddingBottom: 20,
    gap: 12,
  },
  browseButton: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseText: {
    color: Colors.text2,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: Colors.ink200,
  },
  introTermsNote: {
    fontSize: 11,
    lineHeight: 17,
    color: Colors.text3,
    textAlign: 'center',
  },
  introTermsLink: {
    textDecorationLine: 'underline',
    textDecorationColor: Colors.text3,
  },

  // ── Shared screen layout ─────────────────────────────────
  screen: {
    flex: 1,
    paddingHorizontal: Space.s6,
    paddingBottom: Space.s5,
  },
  sectionTitle: {
    marginTop: Space.s8,
    color: Colors.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  sectionSub: {
    marginTop: Space.s2,
    color: Colors.text3,
    fontSize: FontSize.small,
    lineHeight: 21,
  },
  bottomArea: {
    marginTop: 'auto',
  },

  // ── All-agree row ────────────────────────────────────────
  allAgreeRow: {
    marginTop: Space.s8,
    minHeight: 56,
    paddingHorizontal: Space.s4,
    borderRadius: Radius.r2,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.s3,
  },
  allAgreeRowActive: {
    borderColor: Colors.ink1000,
  },
  allAgreeText: {
    color: Colors.text,
    fontSize: FontSize.body,
    fontWeight: '800',
  },

  // ── Term list ────────────────────────────────────────────
  termList: {
    marginTop: Space.s2,
  },
  termRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.hair,
    gap: Space.s3,
    paddingVertical: Space.s1,
  },
  termText: {
    flex: 1,
    color: Colors.text2,
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  termCheckButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── CheckIcon ────────────────────────────────────────────
  checkIcon: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconUnchecked: {
    borderWidth: 2,
    borderColor: Colors.ink200,
    backgroundColor: 'transparent',
  },
  checkIconChecked: {
    borderWidth: 2,
    borderColor: Colors.ink1000,
    backgroundColor: Colors.ink1000,
  },

  // ── Primary button ───────────────────────────────────────
  primaryButton: {
    minHeight: 54,
    borderRadius: Radius.r2,
    backgroundColor: Colors.ink1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.ink25,
    fontSize: FontSize.body,
    fontWeight: '800',
  },
  disabledButton: {
    backgroundColor: Colors.ink100,
  },

  // ── Kakao button ─────────────────────────────────────────
  kakaoButton: {
    minHeight: 54,
    borderRadius: Radius.r2,
    backgroundColor: '#FEE500',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Space.s2,
  },
  kakaoButtonLoading: {
    opacity: 0.85,
  },
  kakaoButtonText: {
    color: Colors.ink1000,
    fontSize: FontSize.body,
    fontWeight: '800',
  },
  kakaoEncryptingText: {
    color: Colors.ink1000,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },

  // ── Form ─────────────────────────────────────────────────
  formGroup: {
    marginTop: Space.s6,
  },
  monoLabel: {
    color: Colors.text3,
    fontSize: FontSize.micro,
    fontWeight: '800',
    letterSpacing: 1.0,
    marginBottom: Space.s2 + 2,
  },
  label: {
    color: Colors.text,
    fontSize: FontSize.small,
    fontWeight: '800',
    marginBottom: Space.s2,
  },
  input: {
    height: 52,
    borderRadius: Radius.r2,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Space.s4,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  inputActive: {
    borderColor: Colors.ink1000,
  },
  inputHelperRow: {
    marginTop: Space.s2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helper: {
    color: Colors.text3,
    fontSize: FontSize.micro,
    fontWeight: '600',
  },
  helperWarn: {
    color: Colors.text2,
  },

  // ── Gender segmented ─────────────────────────────────────
  segmented: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: Radius.r3,
    backgroundColor: Colors.ink50,
    gap: 4,
  },
  genderButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonSelected: {
    backgroundColor: Colors.ink1000,
  },
  genderText: {
    color: Colors.text3,
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: Colors.ink25,
    fontWeight: '800',
  },

  // ── Error ────────────────────────────────────────────────
  errorBox: {
    marginTop: Space.s5,
    padding: Space.s3,
    borderRadius: Radius.r2,
    backgroundColor: '#FCEEEE',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.s2,
  },
  errorText: {
    flex: 1,
    color: '#8C1D18',
    fontSize: FontSize.small,
    lineHeight: 19,
    fontWeight: '700',
  },
});
