import { Box, Container, Heading, Text, VStack, HStack, Card } from "@chakra-ui/react"
import { ColorModeButton } from "./components/ui/color-mode"

function App() {
  return (
    <Box minH="100vh" bg="bg.canvas">
      {/* Header with dark mode toggle */}
      <Box 
        as="header" 
        bg="bg.subtle" 
        borderBottom="1px" 
        borderColor="border.default"
        py={4}
      >
        <Container maxW="container.xl">
          <HStack justify="space-between">
            <Heading size="lg" color="text.primary">
              BRL Quotes
            </Heading>
            <ColorModeButton />
          </HStack>
        </Container>
      </Box>

      {/* Main content */}
      <Container maxW="container.xl" py={10}>
        <VStack gap={8} align="stretch">
          {/* Welcome Section */}
          <Box textAlign="center">
            <Heading size="2xl" mb={4} color="text.primary">
              Currency Exchange Rates
            </Heading>
            <Text fontSize="lg" color="text.secondary">
              Real-time BRL to USD conversion rates from multiple sources
            </Text>
          </Box>

          {/* Demo Cards */}
          <HStack gap={6} wrap="wrap" justify="center">
            <Card.Root 
              width={{ base: "full", md: "300px" }}
              bg="bg.subtle"
              borderColor="border.default"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Heading size="md" color="text.primary">Wise</Heading>
                  <Text color="text.secondary">Loading rates...</Text>
                  <Box 
                    bg="bg.muted" 
                    p={4} 
                    borderRadius="md" 
                    w="full"
                  >
                    <Text color="text.primary" fontWeight="bold">
                      Buy: --
                    </Text>
                    <Text color="text.primary" fontWeight="bold">
                      Sell: --
                    </Text>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root 
              width={{ base: "full", md: "300px" }}
              bg="bg.subtle"
              borderColor="border.default"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Heading size="md" color="text.primary">Nubank</Heading>
                  <Text color="text.secondary">Loading rates...</Text>
                  <Box 
                    bg="bg.muted" 
                    p={4} 
                    borderRadius="md" 
                    w="full"
                  >
                    <Text color="text.primary" fontWeight="bold">
                      Buy: --
                    </Text>
                    <Text color="text.primary" fontWeight="bold">
                      Sell: --
                    </Text>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root 
              width={{ base: "full", md: "300px" }}
              bg="bg.subtle"
              borderColor="border.default"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Heading size="md" color="text.primary">Nomad</Heading>
                  <Text color="text.secondary">Loading rates...</Text>
                  <Box 
                    bg="bg.muted" 
                    p={4} 
                    borderRadius="md" 
                    w="full"
                  >
                    <Text color="text.primary" fontWeight="bold">
                      Buy: --
                    </Text>
                    <Text color="text.primary" fontWeight="bold">
                      Sell: --
                    </Text>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          </HStack>

        </VStack>
      </Container>

      {/* Footer */}
      <Box 
        as="footer" 
        bg="bg.subtle" 
        borderTop="1px" 
        borderColor="border.default"
        py={6}
        mt={10}
      >
        <Container maxW="container.xl">
          <Text textAlign="center" color="text.muted">
            Built with React + Chakra UI + TypeScript
          </Text>
        </Container>
      </Box>
    </Box>
  )
}

export default App