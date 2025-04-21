import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Grid, GridItem } from '@/components/ui/grid'
import { Card } from '@/components/ui/card'
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon'
import { Button, ButtonText } from "@/components/ui/button"
import { Link } from 'expo-router'

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleState = () => {
    setShowPassword((showState) => !showState)
  }

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
          className='bg-white mt-36'
          style={styles.card}
        >
          <Text style={styles.title}>QuickFistAid</Text>
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Login to your account</Text>
          <FormControl
            size='lg'
            className='mt-4'
            isRequired={true}
            isInvalid={false}
          >
            <FormControlLabel>
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
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1">
              <InputField
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChangeText={setPassword}
              />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
            <Text
              style={{
                textAlign: 'right',
                marginTop: 5,
                color: '3fe2238',
                textDecorationLine: 'underline',
              }}
            >
              Forgot Password
            </Text>
          </FormControl>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
              
            }}
          >
          <Button size="lg" variant="solid" style={{ backgroundColor: "#fe2238", }} onPress={() => console.log('Login')}>
            <ButtonText>Login</ButtonText>
          </Button>
          </View>
          <Link
            href="/(auth)/register"
            style={{
              textAlign: 'center',
              marginTop: 10,
              color: '3fe2238',
              textDecorationLine: 'underline',
            }}
          >
            Don't have an account? Sign up
          </Link>
        </Card>
      </GridItem>
      <GridItem _extra={{ className: 'col-span-1 md:col-span-3 lg:col-span-4' }}></GridItem>
    </Grid>
  )
}

const styles = StyleSheet.create({
  card: {
    height: 400,
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