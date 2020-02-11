# Objective-C Lingo

## Method Parameters

### For

Parameters as predicate.

"For" is used in a method signature to express predicate-style parameters. The result is filtered, based on the parameters.

```
- (ObjectType)objectForKey:(KeyType)key;

NSDictionary *fruitsByColor = @{@"green": kiwi, @"red": raspberry};
Fruit *greenFruit = [fruitsByColor objectForKey:@"green"];
// greenFruit == kiwi
```

### From

Parameters are necessary and sufficient.

"From" is used in a method signature to express that the parameter or parameters are sufficient to describe the output. The parameters are likely transformed or coerced into other values or presentations, but may not be combined with other information. The parameters are the only changing factors in the method.

```
NSString *NSStringFromCGPoint(CGPoint point);

CGPoint xyPoint = {13, 42};
NSString *xyString = NSStringFromCGPoint(xyPoint);
// xyString == @"{13, 42}"
```

### With

Parameters are necessary, but not sufficient.

"With" is used in a method signature to express that the parameter or parameters are necessary to the output, but insufficient to fully describe the output. That is, they will be combined with other assumed/implicit information to yield the result.

```
- (NSString *)uppercaseStringWithLocale:(NSLocale *)locale;

NSString *keanu = @"Keanu";
NSLocale *currentLocale = [NSLocale currentLocale];
NSString *upperKeanu = [keanu uppercaseStringWithLocale:currentLocale];
// upperKeanu == @"KEANU";
```

## Method Signature

### shouldXyz

Expresses a **verb**.

```
- (BOOL)shouldAutomaticallyForwardRotationMethods;
```

### wantsXyz

Expresses a **noun**.

```
- (BOOL)wantsPushNotifications;
```

