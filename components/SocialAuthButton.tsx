import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type OAuthProvider = 'oauth_google' | 'oauth_github' | 'oauth_linkedin';

interface SocialAuthButtonProps {
  provider: OAuthProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const providerConfig = {
  oauth_google: {
    name: 'Google',
    icon: 'logo-google' as const,
    colors: ['#DB4437', '#F4B400'],
    textColor: '#FFFFFF',
  },
  oauth_github: {
    name: 'GitHub',
    icon: 'logo-github' as const,
    colors: ['#24292e', '#40444b'],
    textColor: '#FFFFFF',
  },
  oauth_linkedin: {
    name: 'LinkedIn',
    icon: 'logo-linkedin' as const,
    colors: ['#0077B5', '#00A0DC'],
    textColor: '#FFFFFF',
  },
};

export default function SocialAuthButton({
  provider,
  onPress,
  loading = false,
  disabled = false,
}: SocialAuthButtonProps) {
  const config = providerConfig[provider];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={styles.container}>
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, (disabled || loading) && styles.buttonDisabled]}>
        {loading ? (
          <ActivityIndicator size="small" color={config.textColor} />
        ) : (
          <View style={styles.content}>
            <Ionicons name={config.icon} size={20} color={config.textColor} />
            <Text style={[styles.text, { color: config.textColor }]}>
              Continue with {config.name}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
