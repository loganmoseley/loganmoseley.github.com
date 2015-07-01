# Objective-C Lingo

## Method Parameter

### With

Parameter is ready.

Parameter is used as-is in the return value. "With" is used in a method signature to express a parameter that is ready to be combined with other assumed/implicit information to yield the result.

    + (NSString *)favoriteDayTextWithWeekday:(NSString *)weekday;
    $ @"Tuesday" >> @"My favorite day is Tuesday!"

### From

Parameter is not ready.

Parameter must be transformed before being used in the return value. "From" is used in a method signature to express a parameter that is transformed or coerced into another value, and may or may not then be combined with other assumed/implicit information.

    + (NSDate *)nextNoonDateFromWeekday:(NSString *)weekday;
    $ @"Tuesday" >> 2014-10-21 12:00:00

### For

Parameter as predicate.

"For" is used in a method signature to express a predicate-style parameter.

    - (NSArray *)weekdaysForInitialLetter:(NSString *)letter;
    $ @"T" >> @[@"Tuesday", @"Thursday"]

## Method Signature

### shouldXyz

Expresses a **verb**.

    - (BOOL)shouldAutomaticallyForwardRotationMethods;

### wantsXyz

Expresses a **noun**.

    - (BOOL)wantsPushNotifications;
