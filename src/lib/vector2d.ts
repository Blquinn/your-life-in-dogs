export class Vector2D {
	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	// Returns the magnitude (length) of the vector
	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	// Normalizes the vector (sets magnitude to 1)
	normalize(): Vector2D {
		const mag = this.magnitude();
		if (mag !== 0) {
			this.x /= mag;
			this.y /= mag;
		}
		return this;
	}

	// Adds another vector to this vector
	add(other: Vector2D): Vector2D {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	// Subtracts another vector from this vector
	subtract(other: Vector2D): Vector2D {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	// Multiplies the vector by a scalar
	multiply(scalar: number): Vector2D {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	// Divides the vector by a scalar
	divide(scalar: number): Vector2D {
		if (scalar !== 0) {
			this.x /= scalar;
			this.y /= scalar;
		}
		return this;
	}

	// Calculates the dot product of this vector and another vector
	dot(other: Vector2D): number {
		return this.x * other.x + this.y * other.y;
	}

	// Calculates the angle (in radians) between this vector and another vector
	angleBetween(other: Vector2D): number {
		const dotProduct = this.dot(other);
		const magnitudesProduct = this.magnitude() * other.magnitude();
		return Math.acos(dotProduct / magnitudesProduct);
	}

	// Returns a new vector that is a copy of this vector
	clone(): Vector2D {
		return new Vector2D(this.x, this.y);
	}

	// Returns a string representation of the vector
	toString(): string {
		return `(${this.x}, ${this.y})`;
	}
}
