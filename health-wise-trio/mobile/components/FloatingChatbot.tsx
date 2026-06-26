import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AIResp = {
  language?: string;
  summary?: string;
  causes?: string[];
  suggestions?: string[];
  ayurveda?: string[];
  urgency?: 'low' | 'medium' | 'high';
  error?: string;
};

const SUPABASE_URL = 'https://qnscenrjpufcuwioglrc.supabase.co';

const SYS = `You are HealthMate AI, a careful trilingual (English/Hindi/Gujarati) wellness companion.
You NEVER diagnose. You provide safe, general self-care guidance and clearly flag when professional care is needed.
Detect the user's input language and respond ENTIRELY in that same language (en, hi, or gu).
Return STRICT JSON only — no markdown, no prose around it.

JSON shape:
{
  "language": "en"|"hi"|"gu",
  "summary": string,                 // 1 short sentence rephrasing what the user said
  "causes": string[],                // 2-4 plain possible causes
  "suggestions": string[],           // 2-5 safe self-care actions (rest, hydration, OTC categories)
  "ayurveda": string[],              // 2-4 traditional Indian home remedies (e.g., tulsi tea, haldi milk, ginger, ajwain)
  "urgency": "low"|"medium"|"high"   // high = seek urgent care
}

Rules:
- Never name prescription drugs or doses.
- If symptoms suggest emergency (chest pain, stroke signs, heavy bleeding, breathing trouble), set urgency "high" and tell them to seek immediate care.
- Keep each list item short (max ~12 words).`;

export function FloatingChatbot() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; data?: AIResp }>>([]);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
  
  // Initial position bottom-right corner
  const initialX = SCREEN_WIDTH - 76;
  const initialY = SCREEN_HEIGHT - 56 - (Platform.OS === 'ios' ? 98 : 86);

  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const lastOffset = useRef({ x: initialX, y: initialY });

  useEffect(() => {
    const listenerId = pan.addListener((value) => {
      lastOffset.current = value;
    });
    return () => {
      pan.removeListener(listenerId);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Trigger drag only if user moved more than 4 pixels in any direction
        return Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: lastOffset.current.x,
          y: lastOffset.current.y
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const fabWidth = 56;
        const padding = 20;
        const leftLimit = padding;
        const rightLimit = SCREEN_WIDTH - fabWidth - padding;
        
        // Snapping logic: snap to left/right edge
        const snapX = lastOffset.current.x < SCREEN_WIDTH / 2 ? leftLimit : rightLimit;
        
        // Vertical boundary limits
        const headerHeight = Platform.OS === 'ios' ? 48 : 30;
        const bottomLimit = SCREEN_HEIGHT - fabWidth - (Platform.OS === 'ios' ? 20 : 12);
        let snapY = lastOffset.current.y;
        
        if (snapY < headerHeight) {
          snapY = headerHeight;
        } else if (snapY > bottomLimit) {
          snapY = bottomLimit;
        }

        Animated.spring(pan, {
          toValue: { x: snapX, y: snapY },
          useNativeDriver: false,
          friction: 7,
          tension: 40
        }).start();
      }
    })
  ).current;

  const send = async () => {
    if (!input.trim() || busy) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setBusy(true);

    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://bhulso-nai-app.vercel.app';
      const url = `${backendUrl}/api/analyze-symptoms`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: `${userMsg}\nPreferred Language: ${i18n.language}`
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Gemini mobile error:", errorText);
        throw new Error("Gemini API call failed");
      }

      const data: AIResp = await res.json();

      if (data.error) {
        Alert.alert('Error', data.error ?? 'Failed to get AI response');
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: t('common.error') || 'Something went wrong. Please try again.' },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: data.summary ?? '', data },
        ]);
      }
    } catch (e) {
      console.error("Chatbot send error:", e);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: t('common.error') || 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.fab,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y }
            ]
          }
        ]}
      >
        <TouchableOpacity
          onPress={() => setModalOpen(true)}
          activeOpacity={0.85}
          style={styles.fabTouch}
        >
          <LinearGradient
            colors={['#0EA5A4', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Ionicons name="sparkles" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Dialog Modal */}
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleContainer}>
                <LinearGradient
                  colors={['#0EA5A4', '#2563EB']}
                  style={styles.headerIcon}
                >
                  <Ionicons name="sparkles" size={16} color="#fff" />
                </LinearGradient>
                <View>
                  <Text style={styles.headerTitle}>{t('symptoms.title')}</Text>
                  <Text style={styles.headerSub}>HealthMate AI Co-pilot</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                {messages.length > 0 && (
                  <TouchableOpacity onPress={clearChat} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={18} color={Colors.mutedForeground} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.actionBtn}>
                  <Ionicons name="close" size={22} color={Colors.foreground} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chat Messages */}
            <ScrollView
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              keyboardShouldPersistTaps="handled"
            >
              {messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubbles-outline" size={48} color={Colors.mutedForeground} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <Text style={styles.emptyTitle}>AI Health Companion</Text>
                  <Text style={styles.emptyDesc}>
                    {t('symptoms.sub') || 'Describe your symptoms or ask a health question in any language.'}
                  </Text>
                </View>
              ) : (
                messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <View
                      key={index}
                      style={[
                        styles.msgRow,
                        isUser ? styles.msgRowUser : styles.msgRowBot,
                      ]}
                    >
                      {!isUser && (
                        <View style={styles.avatar}>
                          <Ionicons name="sparkles" size={12} color="#fff" />
                        </View>
                      )}
                      <View
                        style={[
                          styles.bubble,
                          isUser ? styles.bubbleUser : styles.bubbleBot,
                        ]}
                      >
                        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
                          {msg.text}
                        </Text>
                        
                        {/* Render structured AI insights inside the chat bubble if present */}
                        {msg.data && (
                          <View style={styles.aiInsights}>
                            {msg.data.urgency && (
                              <View style={[
                                styles.badge, 
                                { 
                                  backgroundColor: 
                                    msg.data.urgency === 'high' 
                                      ? Colors.destructive + '20' 
                                      : msg.data.urgency === 'medium' 
                                      ? Colors.warning + '20' 
                                      : Colors.success + '20',
                                  borderColor: 
                                    msg.data.urgency === 'high' 
                                      ? Colors.destructive 
                                      : msg.data.urgency === 'medium' 
                                      ? Colors.warning 
                                      : Colors.success,
                                }
                              ]}>
                                <Text style={[
                                  styles.badgeText, 
                                  { 
                                    color: 
                                      msg.data.urgency === 'high' 
                                        ? Colors.destructive 
                                        : msg.data.urgency === 'medium' 
                                        ? Colors.warning 
                                        : Colors.success 
                                  }
                                ]}>
                                  Urgency: {t(`symptoms.${msg.data.urgency}`) || msg.data.urgency}
                                </Text>
                              </View>
                            )}

                            {msg.data.causes && msg.data.causes.length > 0 && (
                              <View style={styles.insightSection}>
                                <Text style={styles.sectionTitle}>{t('symptoms.causes')}</Text>
                                {msg.data.causes.map((c, i) => (
                                  <Text key={i} style={styles.bulletItem}>• {c}</Text>
                                ))}
                              </View>
                            )}

                            {msg.data.suggestions && msg.data.suggestions.length > 0 && (
                              <View style={styles.insightSection}>
                                <Text style={styles.sectionTitle}>{t('symptoms.suggestions')}</Text>
                                {msg.data.suggestions.map((c, i) => (
                                  <Text key={i} style={styles.bulletItem}>✓ {c}</Text>
                                ))}
                              </View>
                            )}

                            {msg.data.ayurveda && msg.data.ayurveda.length > 0 && (
                              <View style={[styles.insightSection, styles.ayurBox]}>
                                <Text style={[styles.sectionTitle, { color: Colors.success }]}>🌿 {t('symptoms.ayurveda')}</Text>
                                {msg.data.ayurveda.map((c, i) => (
                                  <Text key={i} style={styles.bulletItem}>🌿 {c}</Text>
                                ))}
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
              {busy && (
                <View style={[styles.msgRow, styles.msgRowBot]}>
                  <View style={styles.avatar}>
                    <Ionicons name="sparkles" size={12} color="#fff" />
                  </View>
                  <View style={[styles.bubble, styles.bubbleBot, { paddingVertical: 12 }]}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Bar */}
            <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
              <TextInput
                style={[styles.input, { maxHeight: 100 }]}
                value={input}
                onChangeText={setInput}
                placeholder={t('symptoms.placeholder') || 'Type your message...'}
                placeholderTextColor={Colors.mutedForeground}
                multiline
              />
              <TouchableOpacity
                onPress={send}
                disabled={busy || !input.trim()}
                style={[
                  styles.sendBtn,
                  (!input.trim() || busy) && styles.sendBtnDisabled,
                ]}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999,
  },
  fabTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '80%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.foreground,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.mutedForeground,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 14,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.foreground,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 18,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '85%',
  },
  msgRowUser: {
    alignSelf: 'flex-end',
  },
  msgRowBot: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: Colors.foreground,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.foreground,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  aiInsights: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  insightSection: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.foreground,
    marginBottom: 3,
  },
  bulletItem: {
    fontSize: 13,
    color: Colors.foreground,
    lineHeight: 18,
  },
  ayurBox: {
    padding: 8,
    backgroundColor: Colors.success + '08',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.success + '20',
  },
});
