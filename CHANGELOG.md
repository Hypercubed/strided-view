# CHANGELOG

## HEAD (Unreleased)

- (breaking) Removed map function argument to `StridedView.random`, use `.map` or `.update` instead
- (feature) Added iterator `Symbol.iterator`
- (feature) and Array-like iterators methods `entries`, `values`, and `keys`
- (feature) Added `inspect`
- (feature) Added `StridedView.combine`
- (feature) Static constructors now use `Float64Array` when possible
- (feature) Added `StridedView.zipWith`
- (feature) Added `neighbors` iterator

---

## 1.0.1 (2025-03-15)

- Optimizations

## 1.0.0 (2025-03-14)

- Initial release
