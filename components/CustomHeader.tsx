import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Avatar, AvatarFallbackText, AvatarImage } from './ui/avatar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export default function CustomHeader({ title }: { title: string }) {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Navigate to Profile
  };

  const handleLogoutClick = async () => {
    console.log('Logout clicked');
    await AsyncStorage.removeItem('userEmail');
    router.replace('/(auth)/login');
    // const email = await AsyncStorage.getItem('userEmail');
    // console.log("🚀 ~ checkEmail ~ email:", email)
  };

  const getEmail = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    if (email) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log('User Data:', userData);
        setUserDetails(userData); // save for showing on UI
      }
    }
  };

  useEffect(() => {
    getEmail()
  }, [])

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>QuickFistAid</Text>

      <TouchableOpacity
        onPress={() => setDropdownVisible(!dropdownVisible)}
        style={styles.avatarContainer}
      >
        <Avatar size="md" style={styles.avatar}>
          <AvatarFallbackText>{userDetails?.firstName}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: 'https://images.unsplash.com/photo-1502685104226-e9df14d4d9f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            }}
          />
        </Avatar>

        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={handleProfileClick} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogoutClick} style={styles.dropdownItem}>
              <Link href="/(auth)/login" style={styles.dropdownText}>Logout</Link>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#fe2238',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fe2238',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    marginRight: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    width: 150, // Added width to the dropdown
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});