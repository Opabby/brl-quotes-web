import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  Spinner,
  Badge,
  Stack,
} from '@chakra-ui/react';
import { apiService } from '../services/api';
import { useApiData } from '../hooks/useApiData';
import { formatCurrency, formatTimestamp } from '../utils/formatters';
// import type { Average } from '../types/api';

export function AveragePage() {
  const { data: average, loading, error } = useApiData(
    () => apiService.getAverage(),
    'Failed to load average rates'
  );

  if (loading) {
    return (
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <VStack gap={{ base: 6, md: 8 }} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text fontSize={{ base: 'md', md: 'lg' }} color="text.secondary">
            Loading average rates...
          </Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <Card.Root bg="red.50" borderColor="red.200">
          <Card.Body p={{ base: 4, md: 6 }}>
            <VStack align="start" gap={3}>
              <Heading size={{ base: 'sm', md: 'md' }} color="red.600">
                Error Loading Data
              </Heading>
              <Text color="red.700" fontSize={{ base: 'sm', md: 'md' }}>
                {error}
              </Text>
              <Text color="text.muted" fontSize="sm">
                Make sure your API is running properly
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }

  if (!average) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
      <VStack gap={{ base: 6, md: 8 }} align="stretch">
        <Box textAlign="center" px={{ base: 2, md: 0 }}>
          <Heading 
            size={{ base: 'xl', md: '2xl' }} 
            mb={{ base: 1, md: 2 }} 
            color="text.primary"
          >
            Average Exchange Rates
          </Heading>
          <Text 
            fontSize={{ base: 'md', md: 'lg' }} 
            color="text.secondary" 
            mb={{ base: 3, md: 4 }}
          >
            Calculated from {average.sources_count} sources
          </Text>
        </Box>

        <Card.Root
          bg="gradient-to-br"
          bgGradient="to-br"
          borderWidth="2px"
          borderColor="blue.200"
          shadow="lg"
        >
          <Card.Body p={{ base: 4, md: 6 }}>
            <VStack gap={{ base: 4, md: 6 }}>
              <Stack
                direction={{ base: 'column', md: 'row' }}
                justify="space-around"
                w="full"
                gap={{ base: 4, md: 6 }}
              >
                <Box 
                  textAlign="center" 
                  minW={{ base: 'auto', md: '200px' }}
                  flex="1"
                  p={{ base: 3, md: 0 }}
                  bg={{ base: 'green.50', md: 'transparent' }}
                  borderRadius={{ base: 'md', md: 'none' }}
                  borderWidth={{ base: '1px', md: '0' }}
                  borderColor={{ base: 'green.200', md: 'transparent' }}
                >
                  <Text 
                    fontSize={{ base: 'xs', md: 'sm' }} 
                    color="text.muted" 
                    mb={2}
                  >
                    Average Buy Price
                  </Text>
                  <Text 
                    fontSize={{ base: '3xl', md: '4xl' }} 
                    fontWeight="bold" 
                    color="green.600"
                  >
                    {formatCurrency(average.average_buy_price)}
                  </Text>
                  <Text fontSize="xs" color="text.secondary" mt={1}>
                    USD → BRL
                  </Text>
                </Box>

                <Box 
                  textAlign="center" 
                  minW={{ base: 'auto', md: '200px' }}
                  flex="1"
                  p={{ base: 3, md: 0 }}
                  bg={{ base: 'blue.50', md: 'transparent' }}
                  borderRadius={{ base: 'md', md: 'none' }}
                  borderWidth={{ base: '1px', md: '0' }}
                  borderColor={{ base: 'blue.200', md: 'transparent' }}
                >
                  <Text 
                    fontSize={{ base: 'xs', md: 'sm' }} 
                    color="text.muted" 
                    mb={2}
                  >
                    Average Sell Price
                  </Text>
                  <Text 
                    fontSize={{ base: '3xl', md: '4xl' }} 
                    fontWeight="bold" 
                    color="blue.600"
                  >
                    {formatCurrency(average.average_sell_price)}
                  </Text>
                  <Text fontSize="xs" color="text.secondary" mt={1}>
                    BRL → USD
                  </Text>
                </Box>
              </Stack>

              <Box
                w="full"
                bg="bg.muted"
                p={{ base: 3, md: 4 }}
                borderRadius="md"
                textAlign="center"
              >
                <Text 
                  fontSize={{ base: 'xs', md: 'sm' }} 
                  color="text.muted" 
                  mb={1}
                >
                  Spread
                </Text>
                <Text 
                  fontSize={{ base: 'xl', md: '2xl' }} 
                  fontWeight="bold" 
                  color="orange.500"
                >
                  {formatCurrency(
                    average.average_buy_price - average.average_sell_price
                  )}
                </Text>
                <Text fontSize="xs" color="text.secondary">
                  ({(
                    ((average.average_buy_price - average.average_sell_price) /
                      average.average_buy_price) *
                    100
                  ).toFixed(2)}
                  %)
                </Text>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        {average.additional_info?.sources && (
          <Card.Root bg="bg.subtle" borderColor="border.default">
            <Card.Header px={{ base: 4, md: 6 }} pt={{ base: 4, md: 6 }} pb={{ base: 2, md: 4 }}>
              <Heading size={{ base: 'sm', md: 'md' }} color="text.primary">
                Data Sources
              </Heading>
            </Card.Header>
            <Card.Body px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
              <VStack align="start" gap={{ base: 2, md: 3 }}>
                {average.additional_info.sources.map((source, index) => (
                  <Stack
                    key={index}
                    direction={{ base: 'column', sm: 'row' }}
                    gap={2}
                    align={{ base: 'start', sm: 'center' }}
                    w="full"
                  >
                    <Badge 
                      colorScheme="purple" 
                      fontSize={{ base: '2xs', md: 'xs' }}
                      flexShrink={0}
                    >
                      Source {index + 1}
                    </Badge>
                    <Text 
                      fontSize={{ base: 'xs', md: 'sm' }} 
                      color="text.secondary" 
                      wordBreak="break-all"
                      lineHeight="1.5"
                    >
                      {source}
                    </Text>
                  </Stack>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>
        )}

        <Box textAlign="center" px={{ base: 2, md: 0 }}>
          <Text 
            fontSize={{ base: 'xs', md: 'sm' }} 
            color="text.muted"
            wordBreak="break-word"
          >
            Last updated: {formatTimestamp(average.timestamp)}
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}