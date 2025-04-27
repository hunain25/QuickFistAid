import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Grid, GridItem } from '@/components/ui/grid'
import { Card } from '@/components/ui/card'
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon'
import { Button, ButtonText } from "@/components/ui/button"
import { Link, useRouter } from 'expo-router';
import { auth, db } from '@/components/firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, setDoc } from 'firebase/firestore'

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false)
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const handleState = () => {
    setShowPassword((showState) => !showState)
  }

  const handleRegister = async () => {
    try {
      if (!email || !password || !firstName || !lastName) {
        alert('Please fill all required fields');
        return;
      }
  
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
  
      console.log(email, password, firstName, lastName, phoneNumber);
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User", user);

      console.log("db", db); // Check if this is a valid Firestore instance
  
      // Explicitly create a collection reference and a document reference
      // const usersCollection = collection(db, 'users'); // Reference to the 'users' collection
      // const userDoc = doc(usersCollection, user.uid); // Reference to the user's document using their UID
  
      // // Set document data
      // await setDoc(userDoc, {
      //   email: user.email,
      //   firstName: firstName || 'No first name', // Use the form field value directly
      //   lastName: lastName || 'No last name', // Use the form field value directly
      //   phoneNumber: phoneNumber || 'No Phone Number', // Use the form field value directly
      //   createdAt: new Date()
      // });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName || 'No first name',
        lastName: lastName || 'No last name',
        phoneNumber: phoneNumber || 'No Phone Number',
        createdAt: new Date().toISOString()
      });
  
      console.log('User saved to Firestore');
      await AsyncStorage.setItem('userEmail', email);
  
      router.replace('/');
    } catch (error: any) {
      console.log('Registration Error: ', error.message);
      alert(error.message);
    }
  };

  return (
    <Grid
      _extra={{
        className: 'col-span-12',
      }}
    >
      <GridItem _extra={{ className: 'col-span-1 md:col-span-3 lg:col-span-4' }}></GridItem>
      <GridItem _extra={{ className: 'col-span-10 md:col-span-6 lg:col-span-4' }}>
        <Card
          size='lg'
          variant='filled'
          className='bg-white mt-10'
          style={styles.card}
        >
          <Text style={styles.title}>QuickFistAid</Text>
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Create your account</Text>
          <FormControl
            size='lg'
            className='mt-4'
            isRequired={true}
            isInvalid={false}
          >
            <FormControlLabel>
              <FormControlLabelText>First Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder='Enter your first name'
                type='text'
                value={firstName}
                onChangeText={setFirstName}
              />
            </Input>
            <FormControlLabel className='mt-4'>
              <FormControlLabelText>Last Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder='Enter your last name'
                type='text'
                value={lastName}
                onChangeText={setLastName}
              />
            </Input>
            <FormControlLabel className='mt-4'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder='Enter your email'
                type='text'
                autoCapitalize='none'
                autoCorrect={false}
                autoComplete='email'
                value={email}
                onChangeText={setEmail}
              />
            </Input>
            <FormControlLabel className='mt-4'>
              <FormControlLabelText>Phone Number</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder='Enter your phone number'
                type='text'
                keyboardType='phone-pad'
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </Input>
            <FormControlLabel className='mt-4'>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1">
              <InputField
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
              />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
            <FormControlLabel className='mt-4'>
              <FormControlLabelText>Confirm Password</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </Input>
          </FormControl>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <Button size="lg" variant="solid" style={{ backgroundColor: '#fe2238' }} onPress={handleRegister}>
              <ButtonText>Register</ButtonText>
            </Button>
          </View>
          <Link
            href="/(auth)/login"
            style={{
              textAlign: 'center',
              marginTop: 10,
              color: '#fe2238',
              textDecorationLine: 'underline',
            }}
          >
            Already have an account? Login
          </Link>
        </Card>
      </GridItem>
      <GridItem _extra={{ className: 'col-span-1 md:col-span-3 lg:col-span-4' }}></GridItem>
    </Grid>
  )
}

const styles = StyleSheet.create({
  card: {
    height: 675,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: '#fe2238',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
})